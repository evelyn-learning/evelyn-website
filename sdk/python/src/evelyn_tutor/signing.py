"""Request signing for ``/api/portal/v1/*``."""

from __future__ import annotations

import hashlib
import hmac
import time
from typing import Dict, Optional

from .errors import EvelynConfigError


def sign_request(
    *,
    method: str,
    path: str,
    partner_id: str,
    secret: str,
    body: Optional[str] = None,
    timestamp: Optional[int] = None,
) -> Dict[str, str]:
    """Signs one API request and returns the three headers it must carry.

    The signature is the hex HMAC-SHA256, with the partner secret, of
    ``<timestamp>.<METHOD>.<path with query string>.<raw body>``.

    Args:
        method: HTTP method. Case does not matter.
        path: the path with its query string and no host, for example ``/api/portal/v1/usage``.
        body: the request body exactly as it will be sent. The bytes signed must be the bytes sent:
            serialise your JSON once, sign that string, and send that same string.
        timestamp: Unix time in milliseconds. Default: now. The API refuses a timestamp more than
            5 minutes from its own clock.

    Raises:
        EvelynConfigError: an argument is missing or malformed.
    """
    if not isinstance(partner_id, str) or not partner_id:
        raise EvelynConfigError("partner_id is required to sign a request.")
    if not isinstance(secret, str) or not secret:
        raise EvelynConfigError("secret is required to sign a request.")
    if not isinstance(path, str) or not path.startswith("/"):
        raise EvelynConfigError('path must start with "/" and carry no host, for example "/api/portal/v1/usage".')
    if body is not None and not isinstance(body, str):
        raise EvelynConfigError("body must be the raw string that will be sent. Call json.dumps once and pass the result to both sign_request and your HTTP client.")
    stamp = str(int(time.time() * 1000) if timestamp is None else timestamp)
    message = f"{stamp}.{method.upper()}.{path}.{body or ''}"
    signature = hmac.new(secret.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).hexdigest()
    return {"x-evelyn-partner": partner_id, "x-evelyn-timestamp": stamp, "x-evelyn-signature": signature}
