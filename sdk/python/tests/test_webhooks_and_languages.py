"""Webhook verification against the shared vectors (sdk/vectors.json), and the languages list."""

import hashlib
import hmac
import json
import threading
import time
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

from evelyn_tutor import (
    BUNDLED_LANGUAGES,
    EvelynConfigError,
    EvelynTutor,
    EvelynWebhookError,
    create_session_token,
    fetch_languages,
    verify_session_token,
    verify_webhook,
)

VECTORS = json.loads((Path(__file__).resolve().parents[2] / "vectors.json").read_text(encoding="utf-8"))
PARTNER_ID = VECTORS["partnerId"]
SECRET = VECTORS["secret"]
ENDED = VECTORS["webhooks"][0]
CODES = ["en", "ja", "zh-TW", "zh-CN", "hi", "hi-Latn", "fr", "es"]


def headers_of(vector):
    return {"x-evelyn-event": vector["type"], "x-evelyn-timestamp": str(vector["timestamp"]), "x-evelyn-signature": vector["signature"]}


class VerifyWebhookTests(unittest.TestCase):
    def assert_refused(self, reason, *args, **kwargs):
        with self.assertRaises(EvelynWebhookError) as raised:
            verify_webhook(*args, **kwargs)
        self.assertEqual(raised.exception.reason, reason)
        return raised.exception

    def test_webhooks_signed_by_the_engine_verify(self):
        for vector in VECTORS["webhooks"]:
            with self.subTest(vector["name"]):
                # The engine's signer (partner-dashboard/webhooks.ts signWebhook): hex HMAC-SHA256 of `${timestamp}.${body}`.
                expected = hmac.new(SECRET.encode(), f"{vector['timestamp']}.{vector['body']}".encode("utf-8"), hashlib.sha256).hexdigest()
                self.assertEqual(vector["signature"], expected)
                event = verify_webhook(vector["body"], headers=headers_of(vector), secret=SECRET, now_ms=vector["timestamp"] + 1000)
                self.assertEqual(event, json.loads(vector["body"]))
                self.assertEqual((event["type"], event["partner_id"]), (vector["type"], PARTNER_ID))

    def test_body_as_bytes_headers_in_any_case_or_as_two_values_and_two_secrets(self):
        now, expected = ENDED["timestamp"], json.loads(ENDED["body"])
        mixed = {"X-Evelyn-Timestamp": str(ENDED["timestamp"]), "X-EVELYN-SIGNATURE": ENDED["signature"].upper()}
        self.assertEqual(verify_webhook(ENDED["body"].encode("utf-8"), headers=mixed, secret=SECRET, now_ms=now), expected)
        self.assertEqual(verify_webhook(bytearray(ENDED["body"].encode("utf-8")), timestamp=str(ENDED["timestamp"]), signature=ENDED["signature"], secret=SECRET, now_ms=now), expected)
        self.assertEqual(verify_webhook(ENDED["body"], headers=headers_of(ENDED), secret=["new-secret", SECRET], now_ms=now), expected)

    def test_wrong_secret_changed_body_or_other_timestamp_is_a_bad_signature(self):
        now = ENDED["timestamp"]
        self.assert_refused("bad_signature", ENDED["body"], headers=headers_of(ENDED), secret="another-secret", now_ms=now)
        self.assert_refused("bad_signature", ENDED["body"].replace("412", "9999"), headers=headers_of(ENDED), secret=SECRET, now_ms=now)
        self.assert_refused("bad_signature", ENDED["body"] + " ", headers=headers_of(ENDED), secret=SECRET, now_ms=now)
        self.assert_refused("bad_signature", ENDED["body"], headers={**headers_of(ENDED), "x-evelyn-timestamp": str(now + 1)}, secret=SECRET, now_ms=now)

    def test_a_request_outside_the_tolerance_is_stale(self):
        arguments = {"headers": headers_of(ENDED), "secret": SECRET}
        self.assert_refused("stale_timestamp", ENDED["body"], now_ms=ENDED["timestamp"] + 300_001, **arguments)
        self.assert_refused("stale_timestamp", ENDED["body"], now_ms=ENDED["timestamp"] - 300_001, **arguments)
        self.assertTrue(verify_webhook(ENDED["body"], now_ms=ENDED["timestamp"] + 300_000, **arguments))
        self.assert_refused("stale_timestamp", ENDED["body"], now_ms=ENDED["timestamp"] + 5000, tolerance_ms=1000, **arguments)
        self.assert_refused("stale_timestamp", ENDED["body"], **arguments)  # the default clock is now

    def test_missing_headers_a_parsed_body_and_a_non_event_are_malformed(self):
        now = ENDED["timestamp"]

        def signed(body):
            return {"timestamp": str(now), "signature": hmac.new(SECRET.encode(), f"{now}.{body}".encode(), hashlib.sha256).hexdigest(), "secret": SECRET, "now_ms": now}

        self.assert_refused("malformed", ENDED["body"], headers={}, secret=SECRET, now_ms=now)
        self.assert_refused("malformed", ENDED["body"], headers={"x-evelyn-timestamp": str(now)}, secret=SECRET, now_ms=now)
        self.assert_refused("malformed", ENDED["body"], timestamp="yesterday", signature=ENDED["signature"], secret=SECRET, now_ms=now)
        self.assert_refused("malformed", ENDED["body"], timestamp=str(now), signature="abc", secret=SECRET, now_ms=now)
        self.assert_refused("malformed", json.loads(ENDED["body"]), headers=headers_of(ENDED), secret=SECRET, now_ms=now)
        self.assert_refused("malformed", "not json", **signed("not json"))
        self.assert_refused("malformed", '{"type":"session.ended"}', **signed('{"type":"session.ended"}'))
        with self.assertRaises(TypeError):
            verify_webhook(ENDED["body"], headers=headers_of(ENDED), secret="", now_ms=now)

    def test_a_delivery_signed_now_verifies_against_the_real_clock(self):
        stamp = str(int(time.time() * 1000))
        signature = hmac.new(SECRET.encode(), f"{stamp}.{ENDED['body']}".encode("utf-8"), hashlib.sha256).hexdigest()
        self.assertEqual(verify_webhook(ENDED["body"], timestamp=stamp, signature=signature, secret=SECRET)["type"], "session.ended")


class LanguagesTests(unittest.TestCase):
    LIVE = [{"code": "en", "label": "English", "english": "English", "firstTopic": "Fractions", "extra": "ignored"}, {"code": "pt-BR", "label": "Português", "english": "Portuguese", "firstTopic": "Frações"}]

    def test_the_bundled_list_has_the_eight_languages(self):
        self.assertEqual([language["code"] for language in BUNDLED_LANGUAGES], CODES)

    def test_the_live_list_is_returned_when_it_can_be_read(self):
        seen = []

        def read(url):
            seen.append(url)
            return json.dumps({"languages": self.LIVE})

        self.assertEqual(fetch_languages(embed_host="http://localhost:3007/", read=read), [{"code": "en", "label": "English", "english": "English", "firstTopic": "Fractions"}, self.LIVE[1]])
        self.assertEqual(seen, ["http://localhost:3007/api/tutor-portal/languages"])

    def test_anything_else_falls_back_to_a_copy_of_the_bundled_list(self):
        def offline(url):
            raise OSError("network unreachable")

        for read in (offline, lambda url: "<html>Not found</html>", lambda url: '{"languages": []}', lambda url: '{"languages": [{"code": "xx"}]}', lambda url: "[]"):
            self.assertEqual([language["code"] for language in fetch_languages(read=read)], CODES)
        copy = fetch_languages(read=offline)
        copy[0]["code"] = "changed"
        self.assertEqual(BUNDLED_LANGUAGES[0]["code"], "en")

    def test_the_client_reads_the_list_from_its_embed_host_over_http(self):
        live = self.LIVE

        class Handler(BaseHTTPRequestHandler):
            def do_GET(self):
                found = self.path == "/api/tutor-portal/languages"
                data = json.dumps({"languages": live}).encode() if found else b"<html>Not found</html>"
                self.send_response(200 if found else 404)
                self.send_header("content-length", str(len(data)))
                self.end_headers()
                self.wfile.write(data)

            def log_message(self, *args):
                pass

        server = HTTPServer(("127.0.0.1", 0), Handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            host = f"http://127.0.0.1:{server.server_port}"
            self.assertEqual([language["code"] for language in EvelynTutor(PARTNER_ID, SECRET, embed_host=host).languages()], ["en", "pt-BR"])
            self.assertEqual([language["code"] for language in EvelynTutor(PARTNER_ID, SECRET, embed_host=host + "/missing").languages()], CODES)
        finally:
            server.shutdown()
            server.server_close()


class SwitchLanguagesClaimTests(unittest.TestCase):
    def read(self, claims):
        return verify_session_token(create_session_token(claims, partner_id=PARTNER_ID, secret=SECRET), SECRET)

    def test_switch_languages_and_unknown_claims_are_written_as_given(self):
        self.assertEqual(self.read({"student_id": "s", "tutor_languages": ["hi-Latn"], "switch_languages": ["hi", "es"]})["switch_languages"], ["hi", "es"])
        self.assertEqual(self.read({"student_id": "s", "switch_languages": "all"})["switch_languages"], "all")
        self.assertIs(self.read({"student_id": "s", "switch_languages": True})["switch_languages"], True)
        self.assertEqual(self.read({"student_id": "s", "an_option_added_later": {"on": True}})["an_option_added_later"], {"on": True})

    def test_a_malformed_switch_languages_is_refused(self):
        for bad in ("hi", [], False, [""], 3):
            with self.subTest(bad=bad), self.assertRaisesRegex(EvelynConfigError, "switch_languages must be a list"):
                create_session_token({"student_id": "s", "switch_languages": bad}, partner_id=PARTNER_ID, secret=SECRET)


if __name__ == "__main__":
    unittest.main()
