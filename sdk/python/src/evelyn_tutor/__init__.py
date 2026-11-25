"""Server-side helpers for the Evelyn Voice Tutor.

Sign a session token, get the session URL, and call the worksheet and usage API.
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
from .errors import EvelynApiError, EvelynConfigError
from .session_token import (
    DEFAULT_EMBED_HOST,
    SessionClaims,
    create_session_token,
    create_session_url,
    session_url,
    verify_session_token,
)
from .signing import sign_request

__version__ = "0.1.0"

__all__ = [
    "DEFAULT_API_HOST",
    "DEFAULT_EMBED_HOST",
    "EvelynApiError",
    "EvelynConfigError",
    "EvelynTutor",
    "ProblemOutcome",
    "ProblemPlan",
    "SessionClaims",
    "SessionSummary",
    "Usage",
    "Worksheet",
    "WorksheetBuildStatus",
    "WorksheetImage",
    "WorksheetProblem",
    "WorksheetReadResult",
    "create_session_token",
    "create_session_url",
    "session_url",
    "sign_request",
    "verify_session_token",
]
