"""The languages a lesson can be taught in."""

from __future__ import annotations

import json
import urllib.request
from typing import Any, Callable, List, Optional, Tuple, TypedDict

from .session_token import DEFAULT_EMBED_HOST


class Language(TypedDict):
    """A language a lesson can be taught in.

    ``code`` goes in ``tutor_languages`` and ``switch_languages``; ``label`` is the language's name in itself;
    ``english`` its name in English; ``firstTopic`` a first topic in that language, for a demo or a test lesson.
    """

    code: str
    label: str
    english: str
    firstTopic: str


BUNDLED_LANGUAGES: Tuple[Language, ...] = (
    {"code": "en", "label": "English", "english": "English", "firstTopic": "Solving linear equations"},
    {"code": "ja", "label": "日本語", "english": "Japanese", "firstTopic": "一次方程式"},
    {"code": "zh-TW", "label": "繁體中文", "english": "Chinese (Traditional)", "firstTopic": "一元一次方程式"},
    {"code": "zh-CN", "label": "简体中文", "english": "Chinese (Simplified)", "firstTopic": "一元一次方程"},
    {"code": "hi", "label": "हिन्दी", "english": "Hindi", "firstTopic": "रैखिक समीकरण"},
    {"code": "hi-Latn", "label": "Hinglish", "english": "Hinglish", "firstTopic": "Solving linear equations"},
    {"code": "fr", "label": "Français", "english": "French", "firstTopic": "Les équations du premier degré"},
    {"code": "es", "label": "Español", "english": "Spanish", "firstTopic": "Ecuaciones de primer grado"},
)
"""The languages as they were when this version was released. :func:`fetch_languages` returns the service's
current list and falls back to this one when the network fails."""

_FIELDS = ("code", "label", "english", "firstTopic")


def _read(url: str) -> str:
    with urllib.request.urlopen(url, timeout=5) as response:
        return response.read().decode("utf-8", "replace")


def fetch_languages(*, embed_host: str = DEFAULT_EMBED_HOST, read: Optional[Callable[[str], str]] = None) -> List[Language]:
    """The languages a lesson can be taught in, from the service's public list (no keys needed).

    Never raises: when the list cannot be read within 5 seconds, the list bundled with this package is returned.

    Args:
        embed_host: host of the developer portal.
        read: your own ``url -> response text`` function, in place of ``urllib``.
    """
    try:
        rows: Any = json.loads((read or _read)(f"{embed_host.rstrip('/')}/api/tutor-portal/languages"))["languages"]
        if isinstance(rows, list) and rows and all(isinstance(row, dict) and row.get("code") and all(isinstance(row.get(f), str) for f in _FIELDS) for row in rows):
            return [{"code": row["code"], "label": row["label"], "english": row["english"], "firstTopic": row["firstTopic"]} for row in rows]
    except Exception:  # noqa: BLE001 - offline, blocked, slow, or not the list: the bundled list answers.
        pass
    return [dict(language) for language in BUNDLED_LANGUAGES]  # type: ignore[misc]
