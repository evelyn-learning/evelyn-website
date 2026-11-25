"""Server-side helpers for the Evelyn Voice Tutor.

Sign a session token, get the session URL, call the worksheet and usage API, and verify webhooks.
Guide: https://tutor.evelynlearning.com/docs/integration.md
"""

from .client import (
    DEFAULT_API_HOST,
    EvelynTutor,
    ProblemOutcome,
    ProblemPlan,
    SessionSummary,
    Usage,
    Worksheet,
    WorksheetBuildStatus,
    WorksheetImage,
    WorksheetProblem,
    WorksheetReadResult,
)
from .errors import EvelynApiError, EvelynConfigError, EvelynWebhookError
from .languages import BUNDLED_LANGUAGES, Language, fetch_languages
from .session_token import (
    DEFAULT_EMBED_HOST,
    SessionClaims,
    create_session_token,
    create_session_url,
    session_url,
    verify_session_token,
)
from .signing import sign_request
from .webhooks import PoolData, SessionEndedData, WebhookEvent, WebhookTestData, verify_webhook

__version__ = "0.1.0"

__all__ = [
    "BUNDLED_LANGUAGES",
    "DEFAULT_API_HOST",
    "DEFAULT_EMBED_HOST",
    "EvelynApiError",
    "EvelynConfigError",
    "EvelynTutor",
    "EvelynWebhookError",
    "Language",
    "PoolData",
    "ProblemOutcome",
    "ProblemPlan",
    "SessionClaims",
    "SessionEndedData",
    "SessionSummary",
    "Usage",
    "Worksheet",
    "WebhookEvent",
    "WebhookTestData",
    "WorksheetBuildStatus",
    "WorksheetImage",
    "WorksheetProblem",
    "WorksheetReadResult",
    "create_session_token",
    "create_session_url",
    "fetch_languages",
    "session_url",
    "sign_request",
    "verify_session_token",
    "verify_webhook",
]
