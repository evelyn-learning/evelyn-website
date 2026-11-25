"""Tokens and request signatures, against the vectors shared with the JavaScript package (sdk/vectors.json)."""

import base64
import hashlib
import hmac
import json
import time
import unittest
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from evelyn_tutor import (
    EvelynConfigError,
    create_session_token,
    create_session_url,
    session_url,
    sign_request,
    verify_session_token,
)

VECTORS = json.loads((Path(__file__).resolve().parents[2] / "vectors.json").read_text(encoding="utf-8"))
PARTNER_ID = VECTORS["partnerId"]
SECRET = VECTORS["secret"]


def b64url(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


class SessionTokenTests(unittest.TestCase):
    def test_tokens_are_byte_identical_to_the_engine_and_the_javascript_package(self):
        for vector in VECTORS["tokens"]:
            with self.subTest(vector["name"]):
                token = create_session_token(vector["claims"], partner_id=PARTNER_ID, secret=SECRET, issued_at=vector["issuedAt"], expires_in_seconds=vector["expiresInSeconds"])
                self.assertEqual(token, vector["token"])
                # The engine's signer (embed-token.ts signEmbedToken), written out with the standard library.
                signed = b64url(b'{"alg":"HS256","typ":"JWT"}') + "." + b64url(vector["payloadJson"].encode("utf-8"))
                expected = signed + "." + b64url(hmac.new(SECRET.encode(), signed.encode(), hashlib.sha256).digest())
                self.assertEqual(token, expected)

    def test_round_trip(self):
        before = int(time.time())
        token = create_session_token({"student_id": "stu_1", "topic": "Fractions", "tutor_languages": ["ja"]}, partner_id=PARTNER_ID, secret=SECRET)
        claims = verify_session_token(token, SECRET)
        self.assertEqual(claims["partner_id"], PARTNER_ID)
        self.assertEqual(claims["student_id"], "stu_1")
        self.assertEqual(claims["tutor_languages"], ["ja"])
        self.assertTrue(before <= claims["iat"] <= before + 2)
        self.assertEqual(claims["exp"] - claims["iat"], 7200)

    def test_claims_set_to_none_are_left_out(self):
        token = create_session_token({"student_id": "s", "topic": None}, partner_id=PARTNER_ID, secret=SECRET, issued_at=1)
        self.assertEqual(list(verify_session_token(token, SECRET, now=1)), ["partner_id", "student_id", "iat", "exp"])

    def test_verify_refuses_wrong_secret_expired_and_malformed(self):
        token = create_session_token({"student_id": "stu_1"}, partner_id=PARTNER_ID, secret=SECRET, issued_at=1000, expires_in_seconds=60)
        with self.assertRaisesRegex(EvelynConfigError, "Bad signature"):
            verify_session_token(token, "another-secret", now=1001)
        with self.assertRaisesRegex(EvelynConfigError, "expired"):
            verify_session_token(token, SECRET, now=1061)
        self.assertEqual(verify_session_token(token, SECRET, now=1060)["student_id"], "stu_1")
        with self.assertRaisesRegex(EvelynConfigError, "three parts"):
            verify_session_token("not-a-token", SECRET)
        header, payload, signature = token.split(".")
        forged = b64url(json.dumps({"partner_id": PARTNER_ID, "student_id": "someone-else"}).encode())
        with self.assertRaisesRegex(EvelynConfigError, "Bad signature"):
            verify_session_token(f"{header}.{forged}.{signature}", SECRET)
        with self.assertRaisesRegex(EvelynConfigError, "HS256"):
            verify_session_token(f"{b64url(b'{}')}.{payload}.{signature}", SECRET)

    def test_claims_with_obvious_mistakes_are_refused(self):
        cases = [
            ({}, "student_id is required"),
            ({"student_id": "  "}, "student_id is required"),
            (None, "must be a dict"),
            ({"student_id": "s", "tutor_languages": "zh-TW"}, "tutor_languages must be a list"),
            ({"student_id": "s", "tutor_languages": []}, "tutor_languages must be a list"),
            ({"student_id": "s", "max_duration_minutes": 0}, "1 to 120"),
            ({"student_id": "s", "max_duration_minutes": 121}, "1 to 120"),
            ({"student_id": "s", "max_duration_minutes": "30"}, "1 to 120"),
            ({"student_id": "s", "max_duration_minutes": True}, "1 to 120"),
            ({"student_id": "s", "input_mode": "speech"}, '"voice" or "text"'),
            ({"student_id": "s", "partner_id": "other"}, 'Leave "partner_id" out'),
            ({"student_id": "s", "exp": 1}, 'Leave "exp" out'),
        ]
        for claims, message in cases:
            with self.subTest(claims=claims), self.assertRaisesRegex(EvelynConfigError, message):
                create_session_token(claims, partner_id=PARTNER_ID, secret=SECRET)
        with self.assertRaisesRegex(EvelynConfigError, "partner_id is required"):
            create_session_token({"student_id": "s"}, partner_id="", secret=SECRET)
        with self.assertRaisesRegex(EvelynConfigError, "secret is required"):
            create_session_token({"student_id": "s"}, partner_id=PARTNER_ID, secret="")
        with self.assertRaisesRegex(EvelynConfigError, "expires_in_seconds"):
            create_session_token({"student_id": "s"}, partner_id=PARTNER_ID, secret=SECRET, expires_in_seconds=0)
        for minutes in (1, 120):
            self.assertTrue(create_session_token({"student_id": "s", "max_duration_minutes": minutes}, partner_id=PARTNER_ID, secret=SECRET))

    def test_session_urls(self):
        self.assertEqual(session_url("a.b.c"), "https://tutor.evelynlearning.com/embed?token=a.b.c")
        self.assertEqual(session_url("a.b.c", host="http://localhost:3007/"), "http://localhost:3007/embed?token=a.b.c")
        url = urlparse(create_session_url({"student_id": "stu_1"}, partner_id=PARTNER_ID, secret=SECRET))
        self.assertEqual(f"{url.scheme}://{url.netloc}{url.path}", "https://tutor.evelynlearning.com/embed")
        self.assertEqual(verify_session_token(parse_qs(url.query)["token"][0], SECRET)["student_id"], "stu_1")


class SignRequestTests(unittest.TestCase):
    def test_signatures_match_the_engine(self):
        for vector in VECTORS["requests"]:
            with self.subTest(vector["name"]):
                headers = sign_request(method=vector["method"], path=vector["path"], body=vector["body"] or None, partner_id=PARTNER_ID, secret=SECRET, timestamp=vector["timestamp"])
                self.assertEqual(headers, {"x-evelyn-partner": PARTNER_ID, "x-evelyn-timestamp": str(vector["timestamp"]), "x-evelyn-signature": vector["signature"]})
                self.assertEqual(headers["x-evelyn-signature"], hmac.new(SECRET.encode(), vector["signingString"].encode("utf-8"), hashlib.sha256).hexdigest())

    def test_timestamp_defaults_to_now_in_milliseconds(self):
        before = int(time.time() * 1000)
        stamp = int(sign_request(method="GET", path="/api/portal/v1/usage", partner_id=PARTNER_ID, secret=SECRET)["x-evelyn-timestamp"])
        self.assertTrue(before <= stamp <= int(time.time() * 1000))

    def test_bad_input_is_refused(self):
        with self.assertRaisesRegex(EvelynConfigError, 'must start with "/"'):
            sign_request(method="GET", path="https://www.evelynlearning.com/api/portal/v1/usage", partner_id=PARTNER_ID, secret=SECRET)
        with self.assertRaisesRegex(EvelynConfigError, "raw string"):
            sign_request(method="POST", path="/x", body={"a": 1}, partner_id=PARTNER_ID, secret=SECRET)
        with self.assertRaisesRegex(EvelynConfigError, "secret is required"):
            sign_request(method="GET", path="/x", partner_id=PARTNER_ID, secret="")


if __name__ == "__main__":
    unittest.main()
