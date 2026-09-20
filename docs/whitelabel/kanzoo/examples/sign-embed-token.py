"""
sign_embed_token.py — mint a signed Voice Tutor embed token (HS256 JWT).
Standard library only. Run on YOUR SERVER, never in the browser.

    PARTNER_ID=kanzoo PARTNER_SECRET=... python3 sign-embed-token.py

Embed URL:  https://tutor.evelynlearning.com/embed?token=<token>
"""
import base64, hashlib, hmac, json, os, time
from pathlib import Path

TEACHERS = json.loads((Path(__file__).parent / "teachers.json").read_text())


def teacher(teacher_id: str) -> dict:
    """Persona (name, style, VOICE) from teachers.json. Always include one in
    the token: it selects the natural Cartesia voice."""
    return next(t for t in TEACHERS if t["id"] == teacher_id)


def _b64url(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).rstrip(b"=").decode()


def sign_embed_token(payload: dict, secret: str) -> str:
    header = _b64url(json.dumps({"alg": "HS256", "typ": "JWT"}, separators=(",", ":")).encode())
    body = _b64url(json.dumps(payload, separators=(",", ":")).encode())
    sig = hmac.new(secret.encode(), f"{header}.{body}".encode(), hashlib.sha256).digest()
    return f"{header}.{body}.{_b64url(sig)}"


if __name__ == "__main__":
    now = int(time.time())
    payload = {
        "partner_id": os.environ["PARTNER_ID"],
        "student_id": "stu_123",           # your internal student id (stable per student)
        "student_name": "Ayaan",
        "subject": "math",
        "level": "Grade 6",
        "topic": "Ratios and unit rates",
        "session_goal": "homework-help",
        "max_duration_minutes": 30,
        "teacher": teacher("ms-elena-vasquez"),
        "target_kind": "freestyle",         # "lessonNode" when curriculum_module is set
        "iat": now,
        "exp": now + 2 * 3600,              # 2 hours; the engine allows a 4 h grace after exp
    }
    print(sign_embed_token(payload, os.environ["PARTNER_SECRET"]))
