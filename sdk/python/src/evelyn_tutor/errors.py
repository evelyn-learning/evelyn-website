"""Errors raised by the package."""

from __future__ import annotations

from typing import Any, Optional

SANDBOX_URL = "https://tutor.evelynlearning.com/sandbox"
"""Where a developer gets a partner id and secret."""


class EvelynConfigError(ValueError):
    """A setup problem on the caller's side: a missing key, a claim the service would refuse, an unreadable
    file. The message says what to change."""


class EvelynWebhookError(Exception):
    """A webhook request that did not pass verification. Answer it with a 4xx status and do not act on it.

    Attributes:
        reason: ``bad_signature``, ``stale_timestamp`` or ``malformed``.
    """

    def __init__(self, reason: str, message: str) -> None:
        self.reason = reason
        super().__init__(f"Webhook refused ({reason}): {message}")


class EvelynApiError(Exception):
    """The API answered with a status outside 200-299.

    Attributes:
        status: HTTP status of the response.
        code: the response's ``error`` field (``unauthorized``, ``bad_request``, ``not_found``...), or ``http_<status>``.
        reason: the response's ``reason`` or ``message`` field when it has one (for example ``bad_signature``).
        body: the parsed JSON body, or the raw text when the body was not JSON.
    """

    def __init__(self, status: int, body: Any, request: str) -> None:
        fields = body if isinstance(body, dict) else {}
        error = fields.get("error")
        reason = fields.get("reason", fields.get("message"))
        self.status = status
        self.code: str = error if isinstance(error, str) else f"http_{status}"
        self.reason: Optional[str] = reason if isinstance(reason, str) else None
        self.body = body
        suffix = f" ({self.reason})" if self.reason else ""
        super().__init__(f"Evelyn API {request} failed: {status} {self.code}{suffix}")
