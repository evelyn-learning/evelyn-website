"""Session tokens: a JWT (HS256) whose claims configure one session for one student."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import math
import time
from typing import Any, Dict, List, Mapping, Optional, TypedDict, Union
from urllib.parse import quote

from .errors import EvelynConfigError

DEFAULT_EMBED_HOST = "https://tutor.evelynlearning.com"
"""Where the hosted session page lives."""

_RESERVED_CLAIMS = ("partner_id", "iat", "exp")


class _RequiredClaims(TypedDict):
    student_id: str


class SessionClaims(_RequiredClaims, total=False):
    """The claims of a session token. The token is the session's whole configuration.

    ``partner_id``, ``iat`` and ``exp`` are set by :func:`create_session_token`.

    Keys:
        student_id: your own stable id for the student. All data kept for the student is keyed on it.
        subject: ``math``, ``science``, ``ela``, ``social-studies`` (also ``cs``, ``languages``).
        level: the grade label, for example ``"Grade 8"``.
        topic: free text, in the lesson's language. Without ``curriculum_module`` the tutor builds the lesson on it.
        student_name: first name; the tutor uses it in conversation.
        target_kind: ``"freestyle"`` for a lesson built on ``topic``; ``"lessonNode"`` when ``curriculum_module`` names a plan.
        curriculum_module: a lesson plan id (a worksheet question, your own material, a catalogue lesson).
        session_goal: ``homework-help``, ``practice``, ``concept-review`` (default), ``test-prep``, ``catch-up``, ``challenge``, ``general``.
        input_mode: ``"voice"`` (default) or ``"text"``. In a voice session the student can also type.
        tutor_languages: the lesson's language. One code teaches the whole lesson in that language: ``["ja"]``,
            ``["zh-TW"]``, ``["zh-CN"]``, ``["hi"]``, ``["hi-Latn"]`` (Hinglish: spoken Hindi mixed with English,
            board in English), ``["fr"]``, ``["es"]``. Leave it out for English. Prefer the codes
            ``languages()`` / ``fetch_languages()`` return over a list written into your code: the service adds languages.
        switch_languages: the languages the student may change the lesson to in the middle of a lesson, by
            asking the tutor: a list of codes, or ``True`` / ``"all"`` for every language offered. Leave it
            out and the lesson's language cannot change.
        max_duration_minutes: hard cap, 1 to 120, default 30. A sandbox session ends at 15 minutes whatever this says.
        session_id: your own session id. Otherwise the service makes one.
        resume: with the same ``session_id``, continue that session instead of starting over (kept 30 days).
        teacher: a ready-made teacher id, or a persona dict (``name``, ``intro``, ``style``, ``voice``).
        voice: a voice code from the Voices and Companions page of the developer docs.
        tutor_opens: text mode only: the tutor opens the session itself.
        progress_digest: ``{unitsCompleted, unitsTotal, percentComplete, weeksElapsed?, paceNote?}``.
        social_memory: ``[{id, note, kind?, capturedAt}]``, used in this session only and never stored.
        branding: ``{primary_color, logo_url, product_name}``.
        features: ``{homework_upload, text_mode, voice_mode}`` booleans.
        metadata: key-value pairs stored with the session for your own reference.
    """

    subject: str
    level: str
    topic: str
    student_name: str
    target_kind: str
    curriculum_module: str
    session_goal: str
    input_mode: str
    tutor_languages: List[str]
    switch_languages: Union[List[str], bool, str]
    max_duration_minutes: Union[int, float]
    session_id: str
    resume: bool
    teacher: Union[str, Dict[str, Any]]
    voice: str
    tutor_opens: bool
    progress_digest: Dict[str, Any]
    social_memory: List[Dict[str, Any]]
    branding: Dict[str, Any]
    features: Dict[str, bool]
    metadata: Dict[str, Any]


def _b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64url_decode(text: str) -> bytes:
    return base64.urlsafe_b64decode(text + "=" * (-len(text) % 4))


def _compact_json(value: Any) -> bytes:
    # The same bytes JSON.stringify writes: no spaces, non-ASCII text left as it is.
    return json.dumps(value, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def _is_text(value: Any) -> bool:
    return isinstance(value, str) and value.strip() != ""


def _validate_claims(claims: Mapping[str, Any]) -> None:
    """Refuses the mistakes that would otherwise show up only as a session that does not start as expected."""
    if not isinstance(claims, Mapping):
        raise EvelynConfigError('Session claims must be a dict, for example {"student_id": "stu_1", "topic": "Fractions"}.')
    for name in _RESERVED_CLAIMS:
        if claims.get(name) is not None:
            raise EvelynConfigError(f'Leave "{name}" out of the claims: it is set from the partner_id, issued_at and expires_in_seconds arguments.')
    if not _is_text(claims.get("student_id")):
        raise EvelynConfigError("student_id is required: your own stable id for the student, as a non-empty string.")
    languages = claims.get("tutor_languages")
    if languages is not None and not (isinstance(languages, (list, tuple)) and len(languages) > 0 and all(_is_text(code) for code in languages)):
        raise EvelynConfigError('tutor_languages must be a list of language codes, for example ["zh-TW"]. Leave it out for English.')
    switch_to = claims.get("switch_languages")
    if switch_to is not None and switch_to is not True and switch_to != "all" and not (isinstance(switch_to, (list, tuple)) and len(switch_to) > 0 and all(_is_text(code) for code in switch_to)):
        raise EvelynConfigError('switch_languages must be a list of language codes, for example ["hi", "es"], or True / "all" for every language. Leave it out to keep the lesson in one language.')
    minutes = claims.get("max_duration_minutes")
    if minutes is not None and not (isinstance(minutes, (int, float)) and not isinstance(minutes, bool) and math.isfinite(minutes) and 1 <= minutes <= 120):
        raise EvelynConfigError("max_duration_minutes must be a number from 1 to 120.")
    if claims.get("input_mode") not in (None, "voice", "text"):
        raise EvelynConfigError('input_mode must be "voice" or "text".')


def create_session_token(
    claims: SessionClaims,
    *,
    partner_id: str,
    secret: str,
    expires_in_seconds: int = 7200,
    issued_at: Optional[int] = None,
) -> str:
    """Signs a session token. Call it on your server for each session; never in a browser or a mobile app.

    Args:
        claims: the session's configuration. Claims set to ``None`` are left out.
        partner_id: your partner id.
        secret: your partner secret.
        expires_in_seconds: seconds until the token expires. Default two hours. A session already running
            may continue for 4 hours past this.
        issued_at: the ``iat`` claim in Unix seconds. Default: now. Set it only for a reproducible token in a test.

    Raises:
        EvelynConfigError: a claim or argument is missing or out of range.
    """
    if not _is_text(partner_id):
        raise EvelynConfigError("partner_id is required to sign a session token.")
    if not _is_text(secret):
        raise EvelynConfigError("secret is required to sign a session token.")
    _validate_claims(claims)
    if isinstance(expires_in_seconds, bool) or not isinstance(expires_in_seconds, (int, float)) or not expires_in_seconds > 0:
        raise EvelynConfigError("expires_in_seconds must be a positive number of seconds.")
    if issued_at is None:
        issued_at = int(time.time())
    elif isinstance(issued_at, bool) or not isinstance(issued_at, int):
        raise EvelynConfigError("issued_at must be a whole number of Unix seconds.")

    payload: Dict[str, Any] = {"partner_id": partner_id}
    payload.update((name, value) for name, value in claims.items() if value is not None)
    payload["iat"] = issued_at
    payload["exp"] = issued_at + int(expires_in_seconds)
    signed = _b64url(_compact_json({"alg": "HS256", "typ": "JWT"})) + "." + _b64url(_compact_json(payload))
    signature = hmac.new(secret.encode("utf-8"), signed.encode("ascii"), hashlib.sha256).digest()
    return signed + "." + _b64url(signature)


def verify_session_token(token: str, secret: str, *, now: Optional[int] = None) -> Dict[str, Any]:
    """Checks a session token's signature and expiry and returns its claims.

    For tests and debugging: the service does its own check when the session page opens.

    Args:
        now: Unix seconds to judge expiry against. Default: the current time.

    Raises:
        EvelynConfigError: the token is malformed, signed with another secret, or expired.
    """
    parts = token.split(".") if isinstance(token, str) else []
    if len(parts) != 3:
        raise EvelynConfigError("Not a session token: expected three parts separated by dots.")
    try:
        header = json.loads(_b64url_decode(parts[0]))
        payload = json.loads(_b64url_decode(parts[1]))
        signature = _b64url_decode(parts[2])
    except ValueError as err:
        raise EvelynConfigError("Malformed session token: the parts are not base64url JSON.") from err
    if not isinstance(header, dict) or header.get("alg") != "HS256":
        raise EvelynConfigError("Unsupported session token: the algorithm must be HS256.")
    if not isinstance(payload, dict) or not _is_text(payload.get("partner_id")):
        raise EvelynConfigError("Malformed session token: the payload has no partner_id.")
    expected = hmac.new(secret.encode("utf-8"), f"{parts[0]}.{parts[1]}".encode("ascii"), hashlib.sha256).digest()
    if not hmac.compare_digest(expected, signature):
        raise EvelynConfigError("Bad signature: the token was not signed with this secret.")
    expiry = payload.get("exp")
    if isinstance(expiry, (int, float)) and expiry < (int(time.time()) if now is None else now):
        raise EvelynConfigError("The session token has expired.")
    return payload


def session_url(token: str, *, host: str = DEFAULT_EMBED_HOST) -> str:
    """The session page URL for a signed token. Put it in an iframe's ``src``, or load it in a mobile WebView."""
    return f"{host.rstrip('/')}/embed?token={quote(token, safe='')}"


def create_session_url(
    claims: SessionClaims,
    *,
    partner_id: str,
    secret: str,
    expires_in_seconds: int = 7200,
    issued_at: Optional[int] = None,
    host: str = DEFAULT_EMBED_HOST,
) -> str:
    """Signs a token for the claims and returns the session page URL in one step."""
    token = create_session_token(claims, partner_id=partner_id, secret=secret, expires_in_seconds=expires_in_seconds, issued_at=issued_at)
    return session_url(token, host=host)
