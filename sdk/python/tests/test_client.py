"""The client's calls, against a recording transport and a local HTTP server."""

import base64
import hashlib
import hmac
import json
import os
import tempfile
import threading
import time
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from unittest import mock
from urllib.parse import parse_qs, urlparse

from evelyn_tutor import EvelynApiError, EvelynConfigError, EvelynTutor, WorksheetImage, verify_session_token

VECTORS = json.loads((Path(__file__).resolve().parents[2] / "vectors.json").read_text(encoding="utf-8"))
PARTNER_ID = VECTORS["partnerId"]
SECRET = VECTORS["secret"]
PNG = bytes.fromhex("89504e470d0a1a0a0000000d49484452")
JPEG = bytes.fromhex("ffd8ffe000104a46494600010100")
API = "https://www.evelynlearning.com"


class Recorder:
    """A transport that records every call and answers from a queue (default: 200 and an empty object)."""

    def __init__(self, *answers):
        self.calls = []
        self.answers = list(answers)

    def __call__(self, method, url, headers, body):
        self.calls.append({"method": method, "url": url, "headers": headers, "body": body})
        status, payload = self.answers.pop(0) if self.answers else (200, {})
        return status, payload if isinstance(payload, str) else json.dumps(payload)


def client(*answers):
    recorder = Recorder(*answers)
    return EvelynTutor(PARTNER_ID, SECRET, transport=recorder), recorder.calls


class ClientTests(unittest.TestCase):
    def assert_signed(self, call, method, path_with_query):
        """Asserts one recorded call: URL, method, and a signature over exactly what was sent. Returns the parsed body."""
        self.assertEqual(call["url"], API + path_with_query)
        self.assertEqual(call["method"], method)
        headers = call["headers"]
        self.assertEqual(headers["x-evelyn-partner"], PARTNER_ID)
        stamp = headers["x-evelyn-timestamp"]
        self.assertLess(abs(time.time() * 1000 - int(stamp)), 5000)
        raw = call["body"] or b""
        message = f"{stamp}.{method}.{path_with_query}.".encode("utf-8") + raw
        self.assertEqual(headers["x-evelyn-signature"], hmac.new(SECRET.encode(), message, hashlib.sha256).hexdigest())
        self.assertEqual(headers.get("content-type"), "application/json" if raw else None)
        return json.loads(raw) if raw else None

    def test_usage_is_a_signed_get_with_no_body(self):
        answer = {"partner_id": PARTNER_ID, "pooled": True, "cap_minutes": 300, "used_minutes": 12, "remaining_minutes": 288, "session_max_minutes": 15}
        tutor, calls = client((200, answer))
        self.assertEqual(tutor.usage(), answer)
        self.assertEqual(len(calls), 1)
        self.assertIsNone(self.assert_signed(calls[0], "GET", "/api/portal/v1/usage"))

    def test_worksheet_read_sends_plan_generate_with_goal_and_base64_images(self):
        answer = {"planId": "gen-1", "kind": "homework-help", "problems": [{"n": 1, "text": "2x + 3 = 7"}]}
        tutor, calls = client((200, answer))
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "sheet.png"
            path.write_bytes(PNG)
            # Four images is the limit, so the six input forms are sent in two calls.
            sheet = tutor.worksheet.read(images=[str(path), path, JPEG, base64.b64encode(JPEG).decode()], text="國二數學作業", subject="math", grade="Grade 8", locale="zh-TW", student_id="stu_1")
            tutor.worksheet.read(images=["data:image/webp;base64," + base64.b64encode(PNG).decode(), WorksheetImage(b"raw", "image/gif")], subject="math", grade="Grade 8")
        self.assertEqual(sheet, answer)
        png, jpeg = base64.b64encode(PNG).decode(), base64.b64encode(JPEG).decode()
        self.assertEqual(self.assert_signed(calls[0], "POST", "/api/portal/v1/plan-generate"), {
            "text": "國二數學作業", "subject": "math", "grade": "Grade 8", "goal": "homework-help", "locale": "zh-TW", "studentId": "stu_1",
            "materials": [
                {"kind": "image", "mimeType": "image/png", "data": png},
                {"kind": "image", "mimeType": "image/png", "data": png},
                {"kind": "image", "mimeType": "image/jpeg", "data": jpeg},
                {"kind": "image", "mimeType": "image/jpeg", "data": jpeg},
            ],
        })
        self.assertIn("國二數學作業".encode("utf-8"), calls[0]["body"], "non-ASCII text is sent as UTF-8, not escaped")
        self.assertEqual(self.assert_signed(calls[1], "POST", "/api/portal/v1/plan-generate"), {
            "text": "Worksheet", "subject": "math", "grade": "Grade 8", "goal": "homework-help",
            "materials": [{"kind": "image", "mimeType": "image/webp", "data": png}, {"kind": "image", "mimeType": "image/gif", "data": base64.b64encode(b"raw").decode()}],
        })

    def test_worksheet_read_takes_typed_questions_with_no_photo(self):
        tutor, calls = client()
        tutor.worksheet.read(text="1. 2x + 3 = 7\n2. 5y = 20", subject="math", grade="Grade 8")
        self.assertEqual(json.loads(calls[0]["body"]), {"text": "1. 2x + 3 = 7\n2. 5y = 20", "subject": "math", "grade": "Grade 8", "goal": "homework-help"})

    def test_worksheet_read_refuses_input_the_api_would_refuse(self):
        tutor, calls = client()
        cases = [
            ({}, "at least one image"),
            ({"images": [PNG] * 5}, "at most 4"),
            ({"images": [b"plain text"]}, "not a JPEG, PNG, WebP or GIF"),
            ({"images": [b"\xff" * 8_000_001]}, "larger than 8 MB"),
            ({"images": ["/no/such/file.png"]}, "could not read the file"),
            ({"images": ["not base64 and not a path!"]}, "must be base64"),
            ({"images": [PNG], "subject": ""}, "subject is required"),
        ]
        for arguments, message in cases:
            with self.subTest(message), self.assertRaisesRegex(EvelynConfigError, message):
                tutor.worksheet.read(**{"subject": "math", "grade": "Grade 8", **arguments})
        self.assertEqual(calls, [])

    def test_prepare_build_status_and_outcome_call_the_homework_endpoints(self):
        plan = {"planId": "gen-q3", "verified": True, "hasFigure": False, "buildStatus": "ready"}
        tutor, calls = client((201, plan), (202, {"started": True}))
        self.assertEqual(tutor.worksheet.prepare("gen-1", 3, wait_ms=8000, prior_note="Got as far as x = 2", prior_confirmed=["part:a"], locale="zh-TW"), plan)
        self.assertEqual(self.assert_signed(calls[0], "POST", "/api/portal/v1/homework-problem-plan"), {"planId": "gen-1", "n": 3, "waitMs": 8000, "priorNote": "Got as far as x = 2", "priorConfirmed": ["part:a"], "locale": "zh-TW"})

        self.assertEqual(tutor.worksheet.build("gen-1"), {"started": True})
        self.assertEqual(self.assert_signed(calls[1], "POST", "/api/portal/v1/homework-build"), {"planId": "gen-1"})
        tutor.worksheet.build("gen-1", first=2)
        self.assertEqual(self.assert_signed(calls[2], "POST", "/api/portal/v1/homework-build"), {"planId": "gen-1", "first": 2})

        tutor.worksheet.status("gen-1")
        self.assert_signed(calls[3], "GET", "/api/portal/v1/homework-build?planId=gen-1")
        tutor.worksheet.outcome("sess 1'&x", "gen-q3")
        self.assert_signed(calls[4], "GET", "/api/portal/v1/homework-problem-outcome?sessionId=sess+1%27%26x&planId=gen-q3")
        tutor.worksheet.outcome("sess-1")
        self.assert_signed(calls[5], "GET", "/api/portal/v1/homework-problem-outcome?sessionId=sess-1")

        with self.assertRaisesRegex(EvelynConfigError, "question number"):
            tutor.worksheet.prepare("gen-1", 0)
        with self.assertRaisesRegex(EvelynConfigError, "plan_id is required"):
            tutor.worksheet.status("")

    def test_worksheet_session_url_opens_a_homework_help_session_on_the_question_plan(self):
        tutor, _ = client()
        url = urlparse(tutor.worksheet.session_url("gen-q3", {"student_id": "stu_1", "subject": "math", "level": "Grade 8", "tutor_languages": ["zh-TW"]}))
        self.assertEqual(f"{url.scheme}://{url.netloc}{url.path}", "https://tutor.evelynlearning.com/embed")
        claims = verify_session_token(parse_qs(url.query)["token"][0], SECRET)
        self.assertEqual((claims["partner_id"], claims["session_goal"], claims["curriculum_module"]), (PARTNER_ID, "homework-help", "gen-q3"))
        self.assertNotIn("topic", claims)
        self.assertNotIn("target_kind", claims)

    def test_session_token_and_url_use_the_clients_keys_and_hosts(self):
        tutor = EvelynTutor(PARTNER_ID, SECRET, embed_host="http://localhost:3007/")
        claims = verify_session_token(tutor.session_token({"student_id": "stu_1"}, expires_in_seconds=60), SECRET)
        self.assertEqual(claims["exp"] - claims["iat"], 60)
        self.assertTrue(tutor.session_url({"student_id": "stu_1"}).startswith("http://localhost:3007/embed?token="))

    def test_sessions_summary_joins_ids_and_returns_the_sessions(self):
        sessions = [{"sessionId": "a", "status": "completed", "startedAt": "2026-11-24T10:00:00.000Z", "studentTurns": 4, "tutorTurns": 5, "boardItems": 2}]
        tutor, calls = client((200, {"sessions": sessions}))
        self.assertEqual(tutor.sessions_summary(["a", "b"]), sessions)
        self.assert_signed(calls[0], "GET", "/api/portal/v1/sessions/summary?ids=a%2Cb")
        for bad in ([], ["x"] * 51, ["a,b"], "abc"):
            with self.subTest(bad=bad), self.assertRaisesRegex(EvelynConfigError, "1 to 50"):
                tutor.sessions_summary(bad)

    def test_a_failed_call_raises_evelyn_api_error(self):
        tutor, _ = client((401, {"error": "unauthorized", "reason": "bad_signature"}), (502, "<html>Bad gateway</html>"), (422, {"error": "scanned_pdf", "message": "No text could be read."}))
        with self.assertRaises(EvelynApiError) as raised:
            tutor.usage()
        error = raised.exception
        self.assertEqual((error.status, error.code, error.reason, error.body), (401, "unauthorized", "bad_signature", {"error": "unauthorized", "reason": "bad_signature"}))
        self.assertEqual(str(error), "Evelyn API GET /api/portal/v1/usage failed: 401 unauthorized (bad_signature)")
        with self.assertRaises(EvelynApiError) as raised:
            tutor.usage()
        self.assertEqual((raised.exception.status, raised.exception.code, raised.exception.body), (502, "http_502", "<html>Bad gateway</html>"))
        with self.assertRaises(EvelynApiError) as raised:
            tutor.worksheet.read(images=[PNG], subject="math", grade="Grade 8")
        self.assertEqual((raised.exception.code, raised.exception.reason), ("scanned_pdf", "No text could be read."))

    def test_keys_default_to_the_environment_and_missing_keys_say_how_to_get_them(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            with self.assertRaisesRegex(EvelynConfigError, r"EVELYN_PARTNER_ID and EVELYN_PARTNER_SECRET are not set\. Sign up at https://tutor\.evelynlearning\.com/sandbox"):
                EvelynTutor()
        with mock.patch.dict(os.environ, {"EVELYN_PARTNER_ID": "from-env"}, clear=True):
            with self.assertRaisesRegex(EvelynConfigError, "EVELYN_PARTNER_SECRET is not set"):
                EvelynTutor()
        with mock.patch.dict(os.environ, {"EVELYN_PARTNER_ID": "from-env", "EVELYN_PARTNER_SECRET": "env-secret", "EVELYN_API_HOST": "http://localhost:1/"}, clear=True):
            tutor = EvelynTutor()
            self.assertEqual((tutor.partner_id, tutor.api_host), ("from-env", "http://localhost:1"))
            self.assertEqual(verify_session_token(tutor.session_token({"student_id": "s"}), "env-secret")["partner_id"], "from-env")

    def test_the_secret_is_not_in_the_repr(self):
        tutor, _ = client()
        self.assertNotIn(SECRET, repr(tutor))
        self.assertNotIn(SECRET, str(tutor))


class UrllibTransportTests(unittest.TestCase):
    """The default transport, against a local server that checks the signature the way the engine does."""

    def setUp(self):
        test = self
        test.seen = []

        class Handler(BaseHTTPRequestHandler):
            def answer(self):
                body = self.rfile.read(int(self.headers.get("content-length") or 0))
                message = f"{self.headers['x-evelyn-timestamp']}.{self.command}.{self.path}.".encode() + body
                signed = hmac.compare_digest(self.headers["x-evelyn-signature"], hmac.new(SECRET.encode(), message, hashlib.sha256).hexdigest())
                test.seen.append((self.command, self.path, body))
                status, payload = (200, {"partner_id": PARTNER_ID, "pooled": False}) if signed else (401, {"error": "unauthorized", "reason": "bad_signature"})
                if signed and self.command == "POST":
                    status, payload = 201, {"planId": "gen-q1", "verified": False, "hasFigure": False, "buildStatus": "preparing"}
                data = json.dumps(payload).encode()
                self.send_response(status)
                self.send_header("content-type", "application/json")
                self.send_header("content-length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)

            do_GET = answer
            do_POST = answer

            def log_message(self, *args):
                pass

        self.server = HTTPServer(("127.0.0.1", 0), Handler)
        threading.Thread(target=self.server.serve_forever, daemon=True).start()
        self.host = f"http://127.0.0.1:{self.server.server_port}"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()

    def test_get_and_post_verify_on_the_server(self):
        tutor = EvelynTutor(PARTNER_ID, SECRET, api_host=self.host)
        self.assertEqual(tutor.usage(), {"partner_id": PARTNER_ID, "pooled": False})
        self.assertEqual(tutor.worksheet.prepare("gen-1", 1, prior_note="聯立")["planId"], "gen-q1")
        self.assertEqual(self.seen[0], ("GET", "/api/portal/v1/usage", b""))
        self.assertEqual(self.seen[1], ("POST", "/api/portal/v1/homework-problem-plan", '{"planId":"gen-1","n":1,"priorNote":"聯立"}'.encode("utf-8")))

    def test_an_error_status_becomes_evelyn_api_error(self):
        tutor = EvelynTutor(PARTNER_ID, "wrong-secret", api_host=self.host)
        with self.assertRaises(EvelynApiError) as raised:
            tutor.usage()
        self.assertEqual((raised.exception.status, raised.exception.reason), (401, "bad_signature"))


if __name__ == "__main__":
    unittest.main()
