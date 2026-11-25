"""The server-side client: signs session tokens and calls the API with your partner secret."""

from __future__ import annotations

import base64
import json
import os
import re
import urllib.error
import urllib.request
from dataclasses import dataclass
from typing import Any, Callable, Dict, List, Mapping, Optional, Sequence, Tuple, TypedDict, Union
from urllib.parse import urlencode

from .errors import SANDBOX_URL, EvelynApiError, EvelynConfigError
from .languages import Language, fetch_languages
from .session_token import DEFAULT_EMBED_HOST, SessionClaims, create_session_token, session_url
from .signing import sign_request

DEFAULT_API_HOST = "https://www.evelynlearning.com"
"""Where ``/api/portal/v1/*`` is served."""

_API_BASE = "/api/portal/v1"
_MAX_IMAGES = 4
_MAX_IMAGE_BYTES = 8_000_000
_MAX_SUMMARY_IDS = 50
_IMAGE_PATH = re.compile(r"\.(jpe?g|png|webp|gif)$", re.IGNORECASE)
_DATA_URL = re.compile(r"^data:([^;,]+);base64,")

Transport = Callable[[str, str, Dict[str, str], Optional[bytes]], Tuple[int, str]]
"""``(method, url, headers, body) -> (status, response text)``. Replace it to use your own HTTP client."""

ImageData = Union[bytes, bytearray, str, "os.PathLike[str]"]
"""Image bytes, a base64 string (a ``data:`` URL is accepted), or the path of a .jpg, .jpeg, .png, .webp or .gif file."""


class Usage(TypedDict, total=False):
    """``GET /usage``: your tutoring minute pool. Only ``partner_id`` and ``pooled`` are present when no pool applies.

    Minutes are wall clock per sitting, from the tutor's start to its end, pauses included.
    """

    partner_id: str
    pooled: bool
    cap_minutes: float
    used_minutes: float
    remaining_minutes: float
    session_max_minutes: float


class WorksheetProblem(TypedDict):
    """One question of a worksheet, as printed. ``n`` is the printed number, or the position on an unnumbered sheet."""

    n: int
    text: str


class WorksheetReadResult(TypedDict, total=False):
    """``POST /plan-generate`` with goal ``homework-help``.

    ``planId`` is the sheet's id. ``problems`` (up to 25) is absent when the service could not split the
    material into questions; ``planId`` is then an ordinary lesson plan on the material and can be used as
    ``curriculum_module`` directly.
    """

    planId: str
    title: str
    mode: str
    los: List[Dict[str, str]]
    maxPickableLos: int
    estimatedMinutes: int
    generatorOk: bool
    cached: bool
    kind: str
    problems: List[WorksheetProblem]


class ProblemPlan(TypedDict):
    """``POST /homework-problem-plan``: the plan of one question.

    Open the session with ``planId`` as ``curriculum_module``. ``buildStatus`` is ``preparing``, ``ready``
    or ``unverified``; ``verified`` is true when the answer was prepared and checked before the session.
    """

    planId: str
    verified: bool
    hasFigure: bool
    buildStatus: str


class WorksheetBuildStatus(TypedDict):
    """``GET /homework-build``: progress of preparing every question of a sheet.

    Each entry of ``problems`` has ``n``, ``status``, ``hasFigure``, ``verify`` and, once checked, ``finals``:
    the final answers. Keep those on your server; never show them to the student.
    """

    planId: str
    done: bool
    startedAt: str
    updatedAt: str
    problems: List[Dict[str, Any]]


class ProblemOutcome(TypedDict):
    """``GET /homework-problem-outcome``: how one question's session went. Never contains an answer.

    ``outcome`` is ``done``, ``in_progress`` or ``needs_review``. Pass ``priorNote`` and ``confirmed`` to
    ``worksheet.prepare`` (as ``prior_note`` and ``prior_confirmed``) when the student returns to the question.
    """

    outcome: str
    priorNote: str
    confirmed: List[str]


class _SessionSummaryRequired(TypedDict):
    sessionId: str
    status: str
    startedAt: str
    studentTurns: int
    tutorTurns: int
    boardItems: int


class SessionSummary(_SessionSummaryRequired, total=False):
    """Facts about one session. ``durationSec`` is active tutoring seconds; ``status`` is ``active``, ``completed`` or ``abandoned``."""

    endedAt: str
    durationSec: int
    mode: str
    location: Dict[str, str]


@dataclass(frozen=True)
class WorksheetImage:
    """A photo of a worksheet with its type stated. Use it when the type cannot be read from the image's first bytes."""

    data: ImageData
    mime_type: Optional[str] = None


def _urllib_transport(timeout: float) -> Transport:
    def send(method: str, url: str, headers: Dict[str, str], body: Optional[bytes]) -> Tuple[int, str]:
        request = urllib.request.Request(url, data=body, method=method, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.status, response.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as err:
            return err.code, err.read().decode("utf-8", "replace")

    return send


def _sniff_image_type(data: bytes) -> Optional[str]:
    """The image type named by a file's first bytes."""
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:4] == b"\x89PNG":
        return "image/png"
    if data[:4] == b"GIF8":
        return "image/gif"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


def _to_material(image: Union[ImageData, WorksheetImage], index: int) -> Dict[str, str]:
    """Turns one image input into the ``materials`` entry the API takes."""
    label = f"images[{index}]"
    declared = image.mime_type if isinstance(image, WorksheetImage) else None
    data = image.data if isinstance(image, WorksheetImage) else image
    if isinstance(data, os.PathLike) or (isinstance(data, str) and _IMAGE_PATH.search(data)):
        try:
            with open(data, "rb") as handle:
                raw = handle.read()
        except OSError as err:
            raise EvelynConfigError(f"{label}: could not read the file {os.fspath(data)} ({err.strerror or err}).") from err
    elif isinstance(data, str):
        data_url = _DATA_URL.match(data)
        if data_url:
            declared = declared or data_url.group(1)
            data = data[data_url.end():]
        try:
            raw = base64.b64decode(re.sub(r"\s+", "", data), validate=True)
        except ValueError as err:
            raise EvelynConfigError(f"{label}: a string must be base64, or the path of a .jpg, .png, .webp or .gif file.") from err
    elif isinstance(data, (bytes, bytearray)):
        raw = bytes(data)
    else:
        raise EvelynConfigError(f"{label}: give bytes, a base64 string, or the path of a .jpg, .png, .webp or .gif file.")
    if len(raw) == 0:
        raise EvelynConfigError(f"{label}: the image is empty.")
    if len(raw) > _MAX_IMAGE_BYTES:
        raise EvelynConfigError(f"{label}: the image is larger than 8 MB. Send a smaller photo.")
    mime_type = declared or _sniff_image_type(raw)
    if not mime_type:
        raise EvelynConfigError(f"{label}: not a JPEG, PNG, WebP or GIF image. Convert it, or pass WorksheetImage(data, mime_type) if it is one of those.")
    return {"kind": "image", "mimeType": mime_type, "data": base64.b64encode(raw).decode("ascii")}


def _require_id(value: Any, name: str) -> None:
    if not isinstance(value, str) or not value:
        raise EvelynConfigError(f"{name} is required.")


class Worksheet:
    """The worksheet flow: read a photo, prepare the question the student picked, open a session on it."""

    def __init__(self, client: "EvelynTutor") -> None:
        self._client = client

    def read(
        self,
        *,
        subject: str,
        grade: str,
        images: Sequence[Union[ImageData, WorksheetImage]] = (),
        text: Optional[str] = None,
        locale: Optional[str] = None,
        student_id: Optional[str] = None,
    ) -> WorksheetReadResult:
        """Sends the photos and returns the numbered questions. Uses no tutoring minutes.

        Args:
            subject: ``math``, ``science``, ``ela``, ``social-studies`` (also ``cs``, ``languages``).
            grade: the grade label, for example ``"Grade 8"``.
            images: up to 4 photos, each up to 8 MB (JPEG, PNG, WebP or GIF).
            text: a short description of the sheet in the lesson's language (at least 3 characters), or,
                with no images, the questions themselves as typed text. Default with images: ``"Worksheet"``.
            locale: the language the sheet's session will be taught in, for example ``"zh-TW"``.
            student_id: your id for the student whose sheet this is. With it, the stored questions are
                deleted when you erase the student.
        """
        if isinstance(images, (bytes, bytearray, str)) or len(images) > _MAX_IMAGES:
            raise EvelynConfigError(f"images must be a list of at most {_MAX_IMAGES} photos.")
        _require_id(subject, "subject")
        _require_id(grade, "grade")
        if text is None:
            text = "Worksheet" if images else ""
        if not isinstance(text, str) or len(text.strip()) < 3 or len(text) > 8000:
            raise EvelynConfigError("text must be 3 to 8000 characters." if images else "Give at least one image, or the questions as text (3 to 8000 characters).")
        body: Dict[str, Any] = {"text": text, "subject": subject, "grade": grade, "goal": "homework-help"}
        if locale:
            body["locale"] = locale
        if student_id:
            body["studentId"] = student_id
        if images:
            body["materials"] = [_to_material(image, index) for index, image in enumerate(images)]
        return self._client._request("POST", "/plan-generate", body)

    def prepare(
        self,
        plan_id: str,
        n: int,
        *,
        wait_ms: Optional[int] = None,
        prior_note: Optional[str] = None,
        prior_confirmed: Optional[Sequence[str]] = None,
        locale: Optional[str] = None,
    ) -> ProblemPlan:
        """Prepares question ``n`` of a sheet and returns that question's plan id.

        Args:
            wait_ms: how long the call may wait for the question to be prepared, 0 to 8000. Default 8000.
            prior_note: the ``priorNote`` of an earlier session on this question (from :meth:`outcome`).
            prior_confirmed: the ``confirmed`` list of an earlier session on this question.
            locale: the language the session is taught in, for a sheet that was read without a ``locale``.
        """
        _require_id(plan_id, "plan_id")
        if isinstance(n, bool) or not isinstance(n, int) or n < 1:
            raise EvelynConfigError("n must be the question number, a whole number from 1.")
        optional = {"waitMs": wait_ms, "priorNote": prior_note, "priorConfirmed": None if prior_confirmed is None else list(prior_confirmed), "locale": locale}
        body = {"planId": plan_id, "n": n, **{name: value for name, value in optional.items() if value is not None}}
        return self._client._request("POST", "/homework-problem-plan", body)

    def build(self, plan_id: str, *, first: Optional[int] = None) -> Dict[str, bool]:
        """Starts preparing every question of a sheet in the background, so :meth:`prepare` answers at once.

        ``first`` names the question to prepare first. Returns ``{"started": bool}``.
        """
        _require_id(plan_id, "plan_id")
        return self._client._request("POST", "/homework-build", {"planId": plan_id} if first is None else {"planId": plan_id, "first": first})

    def status(self, plan_id: str) -> WorksheetBuildStatus:
        """Progress of :meth:`build`. Raises ``EvelynApiError`` (404, ``not_found``) until a build has been started."""
        _require_id(plan_id, "plan_id")
        return self._client._request("GET", "/homework-build?" + urlencode({"planId": plan_id}))

    def outcome(self, session_id: str, plan_id: Optional[str] = None) -> ProblemOutcome:
        """How the session on one question went.

        ``plan_id`` is the question's plan id; needed only when the session never loaded its plan.
        """
        _require_id(session_id, "session_id")
        query = {"sessionId": session_id} if not plan_id else {"sessionId": session_id, "planId": plan_id}
        return self._client._request("GET", "/homework-problem-outcome?" + urlencode(query))

    def session_url(self, problem_plan_id: str, claims: SessionClaims, *, expires_in_seconds: int = 7200) -> str:
        """The session URL for one prepared question: the claims plus ``session_goal: "homework-help"`` and ``curriculum_module``."""
        _require_id(problem_plan_id, "problem_plan_id")
        merged: Any = {**claims, "session_goal": "homework-help", "curriculum_module": problem_plan_id}
        return self._client.session_url(merged, expires_in_seconds=expires_in_seconds)


class EvelynTutor:
    """Signs session tokens and calls the API.

    ::

        tutor = EvelynTutor()  # reads EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET
        url = tutor.session_url({"student_id": "stu_1", "subject": "math", "level": "Grade 8",
                                 "topic": "Linear equations", "target_kind": "freestyle"})

    Args:
        partner_id: your partner id. Default: the ``EVELYN_PARTNER_ID`` environment variable.
        secret: your partner secret. Default: the ``EVELYN_PARTNER_SECRET`` environment variable.
        api_host: host of the API. Default: ``EVELYN_API_HOST``, else ``https://www.evelynlearning.com``.
        embed_host: host of the session page. Default: ``EVELYN_EMBED_HOST``, else ``https://tutor.evelynlearning.com``.
        timeout: seconds to wait for an API answer. Reading a worksheet photo is the slow call.
        transport: your own HTTP function, in place of ``urllib``.

    Raises:
        EvelynConfigError: the partner id or secret is missing.
    """

    def __init__(
        self,
        partner_id: Optional[str] = None,
        secret: Optional[str] = None,
        *,
        api_host: Optional[str] = None,
        embed_host: Optional[str] = None,
        timeout: float = 120.0,
        transport: Optional[Transport] = None,
    ) -> None:
        partner_id = partner_id or os.environ.get("EVELYN_PARTNER_ID")
        secret = secret or os.environ.get("EVELYN_PARTNER_SECRET")
        missing = [name for name, value in (("EVELYN_PARTNER_ID", partner_id), ("EVELYN_PARTNER_SECRET", secret)) if not value]
        if not partner_id or not secret:
            raise EvelynConfigError(
                f"{' and '.join(missing)} {'are' if len(missing) > 1 else 'is'} not set. Sign up at {SANDBOX_URL} (email, confirm the link), "
                "copy the partner id and secret from the dashboard, and set them as environment variables on your server, or pass partner_id and secret."
            )
        self.partner_id = partner_id
        self.api_host = (api_host or os.environ.get("EVELYN_API_HOST") or DEFAULT_API_HOST).rstrip("/")
        self.embed_host = (embed_host or os.environ.get("EVELYN_EMBED_HOST") or DEFAULT_EMBED_HOST).rstrip("/")
        self.worksheet = Worksheet(self)
        self._secret = secret
        self._transport = transport or _urllib_transport(timeout)

    def __repr__(self) -> str:
        # The secret is left out, so a logged client never leaks it.
        return f"EvelynTutor(partner_id={self.partner_id!r}, api_host={self.api_host!r})"

    def session_token(self, claims: SessionClaims, *, expires_in_seconds: int = 7200) -> str:
        """Signs a session token for one student and one session."""
        return create_session_token(claims, partner_id=self.partner_id, secret=self._secret, expires_in_seconds=expires_in_seconds)

    def session_url(self, claims: SessionClaims, *, expires_in_seconds: int = 7200) -> str:
        """Signs a token and returns the session page URL: an iframe's ``src``, or the URL a mobile WebView loads.

        Minutes are used only once the student starts the session.
        """
        return session_url(self.session_token(claims, expires_in_seconds=expires_in_seconds), host=self.embed_host)

    def languages(self) -> List[Language]:
        """The languages a lesson can be taught in: the service's current list, or the list bundled with this
        package when the network fails. Needs no keys and never raises. Use a ``code`` as ``tutor_languages: [code]``."""
        return fetch_languages(embed_host=self.embed_host)

    def usage(self) -> Usage:
        """Your tutoring minute pool: minutes used and left. Cache the answer for 60 seconds."""
        return self._request("GET", "/usage")

    def sessions_summary(self, ids: Sequence[str]) -> List[SessionSummary]:
        """Facts for up to 50 sessions. Ids that are unknown, or another partner's, are left out of the answer."""
        if isinstance(ids, str) or not 1 <= len(ids) <= _MAX_SUMMARY_IDS or any(not isinstance(i, str) or not i or "," in i for i in ids):
            raise EvelynConfigError(f"ids must be 1 to {_MAX_SUMMARY_IDS} session ids, none containing a comma.")
        return self._request("GET", "/sessions/summary?" + urlencode({"ids": ",".join(ids)}))["sessions"]

    def _request(self, method: str, route: str, body: Optional[Mapping[str, Any]] = None) -> Any:
        """One signed call. The body is serialised once; that string is both signed and sent."""
        path = _API_BASE + route
        raw = None if body is None else json.dumps(body, separators=(",", ":"), ensure_ascii=False)
        headers = sign_request(method=method, path=path, body=raw, partner_id=self.partner_id, secret=self._secret)
        if raw is not None:
            headers["content-type"] = "application/json"
        status, text = self._transport(method, self.api_host + path, headers, None if raw is None else raw.encode("utf-8"))
        try:
            parsed: Any = json.loads(text) if text else None
        except ValueError:
            # Not JSON (a proxy's error page, for example): the raw text is kept as the body.
            parsed = text
        if not 200 <= status < 300:
            raise EvelynApiError(status, parsed, f"{method} {path.split('?')[0]}")
        return parsed
