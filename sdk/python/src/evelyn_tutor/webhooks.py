"""Webhooks: checking that a request to your webhook URL came from the service."""

from __future__ import annotations

import hashlib
import hmac
import json
import re
import time
from typing import Any, Dict, List, Mapping, Optional, Sequence, TypedDict, Union

from .errors import EvelynWebhookError


class SessionEndedData(TypedDict):
    """What ``session.ended`` carries: the session's facts as saved. No transcript."""

    session_id: str
    student_id: Optional[str]
    started_at: Optional[str]
    ended_at: Optional[str]
    duration_seconds: int
    status: str
    languages: List[str]
    subject: Optional[str]
    topic: Optional[str]
    input_mode: str
    message_count: int


class PoolData(TypedDict):
    """What ``pool.low`` (80% of your minutes used) and ``pool.exhausted`` (all used) carry."""

    cap_minutes: float
    used_minutes: float
    remaining_minutes: float


class WebhookTestData(TypedDict):
    """What ``webhook.test`` (the dashboard's "send a test event" button) carries."""

    message: str


class WebhookEvent(TypedDict):
    """A verified webhook event.

    ``type`` is ``session.ended``, ``pool.low``, ``pool.exhausted`` or ``webhook.test``, and ``data`` is the
    matching :class:`SessionEndedData`, :class:`PoolData` or :class:`WebhookTestData`. ``id`` is the same on
    every retry of one event: use it to drop duplicates. The service may add event types: answer 2xx to a
    type you do not handle.
    """

    id: str
    type: str
    created: str
    partner_id: str
    data: Union[SessionEndedData, PoolData, WebhookTestData, Dict[str, Any]]


_TIMESTAMP = re.compile(r"\d+", re.ASCII)
_SIGNATURE = re.compile(r"[0-9a-fA-F]{64}")


def _header(headers: Optional[Mapping[str, Any]], name: str) -> Optional[str]:
    """A header by name in any case, from a framework's headers object or a plain dict."""
    if headers is None:
        return None
    value = headers.get(name)
    if value is None:
        value = next((v for k, v in headers.items() if isinstance(k, str) and k.lower() == name), None)
    return value if isinstance(value, str) else None


def verify_webhook(
    raw_body: Union[bytes, bytearray, str],
    *,
    secret: Union[str, Sequence[str]],
    headers: Optional[Mapping[str, Any]] = None,
    timestamp: Optional[str] = None,
    signature: Optional[str] = None,
    tolerance_ms: int = 300_000,
    now_ms: Optional[int] = None,
) -> WebhookEvent:
    """Checks that a webhook request came from the service and returns its event.

    The signature is the hex HMAC-SHA256, with your partner secret, of ``<x-evelyn-timestamp>.<raw body>``.
    It is compared in constant time, and a request older than ``tolerance_ms`` is refused.

    Args:
        raw_body: the request body exactly as received, before any JSON parsing
            (Flask: ``request.get_data()``; FastAPI: ``await request.body()``; Django: ``request.body``).
        secret: your partner secret. While you rotate keys, give both the new and the old one.
        headers: the request's headers. Or give ``timestamp`` and ``signature`` yourself.
        timestamp: the ``x-evelyn-timestamp`` header, when ``headers`` is not given.
        signature: the ``x-evelyn-signature`` header, when ``headers`` is not given.
        tolerance_ms: how old a request may be. Default 5 minutes.
        now_ms: the current time in Unix milliseconds. Default: now. For tests.

    Raises:
        EvelynWebhookError: with ``reason`` ``malformed`` (a header is missing or the body is not an event),
            ``stale_timestamp`` or ``bad_signature``.
    """
    secrets = [secret] if isinstance(secret, str) else list(secret or ())
    secrets = [s for s in secrets if isinstance(s, str) and s]
    if not secrets:
        raise TypeError("verify_webhook needs your partner secret.")
    timestamp = timestamp or _header(headers, "x-evelyn-timestamp")
    signature = signature or _header(headers, "x-evelyn-signature")
    if not timestamp or not signature:
        raise EvelynWebhookError("malformed", "The x-evelyn-timestamp or x-evelyn-signature header is missing.")
    if not _TIMESTAMP.fullmatch(timestamp) or not _SIGNATURE.fullmatch(signature):
        raise EvelynWebhookError("malformed", "The timestamp must be Unix milliseconds and the signature 64 hex characters.")
    if isinstance(raw_body, str):
        body = raw_body.encode("utf-8")
    elif isinstance(raw_body, (bytes, bytearray)):
        body = bytes(raw_body)
    else:
        raise EvelynWebhookError("malformed", "The raw request body is needed, as bytes or a string, before any JSON parsing.")
    now = int(time.time() * 1000) if now_ms is None else now_ms
    if abs(now - int(timestamp)) > tolerance_ms:
        raise EvelynWebhookError("stale_timestamp", "The request is older than the tolerance (or this machine's clock is wrong).")
    given = bytes.fromhex(signature)
    message = timestamp.encode("ascii") + b"." + body
    # Every secret is tried, so the time taken does not say which one matched.
    matches = [hmac.compare_digest(given, hmac.new(s.encode("utf-8"), message, hashlib.sha256).digest()) for s in secrets]
    if not any(matches):
        raise EvelynWebhookError("bad_signature", "The signature does not match: the secret is not this partner's, or the body was changed before it was checked.")
    try:
        event = json.loads(body.decode("utf-8"))
    except ValueError as err:
        raise EvelynWebhookError("malformed", "The body is not JSON.") from err
    if not isinstance(event, dict) or not isinstance(event.get("id"), str) or not isinstance(event.get("type"), str) or not isinstance(event.get("data"), dict):
        raise EvelynWebhookError("malformed", "The body is not an event: id, type or data is missing.")
    return event  # type: ignore[return-value]
