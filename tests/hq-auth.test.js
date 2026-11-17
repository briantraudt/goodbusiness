import test from "node:test";
import assert from "node:assert/strict";
import { scryptSync } from "node:crypto";
import { makeSession, passwordMatches, readCookie, sessionValid } from "../lib/hq-auth.js";

const stored = `scrypt$abcd$${scryptSync("right horse", "abcd", 32).toString("hex")}`;

test("password check", () => {
  assert.equal(passwordMatches("right horse", stored), true);
  assert.equal(passwordMatches("wrong", stored), false);
  assert.equal(passwordMatches("", stored), false);
  assert.equal(passwordMatches("right horse", ""), false);
  assert.equal(passwordMatches(undefined, stored), false);
});

test("session is signed and expires", () => {
  const now = 1_800_000_000_000;
  const session = makeSession("secret", now);
  assert.equal(sessionValid("secret", session, now + 1000), true);
  assert.equal(sessionValid("other", session, now + 1000), false);
  assert.equal(sessionValid("secret", session, now + 31 * 864e5), false);
  const [expires, mac] = session.split(".");
  assert.equal(sessionValid("secret", `${Number(expires) + 1}.${mac}`, now), false);
  assert.equal(sessionValid("secret", "", now), false);
  assert.equal(sessionValid("", session, now), false);
});

test("cookie parsing", () => {
  assert.equal(readCookie({ headers: { cookie: "a=1; hq_session=abc.def; b=2" } }, "hq_session"), "abc.def");
  assert.equal(readCookie({ headers: {} }, "hq_session"), "");
});
