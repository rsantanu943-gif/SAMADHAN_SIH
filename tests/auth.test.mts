import { test } from "node:test";
import assert from "node:assert/strict";
import { isApprovedEmail } from "../lib/auth/approved-emails.ts";
import handlers from "../netlify/functions/identity.mts";

test("only the two approved mailboxes are allowed, with normalized casing", () => {
  assert.equal(isApprovedEmail("rsantanurana943@gmail.com"), true);
  assert.equal(isApprovedEmail(" SHARMAHIMANSHUPRINCE@GMAIL.COM "), true);
  for (const email of [undefined, null, "", "outsider@gmail.com", "rsantanurana943+other@gmail.com", "rsantanurana943@gmail.com.evil.test"]) {
    assert.equal(isApprovedEmail(email), false);
  }
});

for (const [eventName, handler] of Object.entries(handlers)) {
  test(`${eventName} denies outsiders and changes to an unapproved email`, () => {
    for (const user of [
      { id: "test", email: "outsider@example.com" },
      { id: "test" },
      { id: "test", email: "rsantanurana943@gmail.com", pendingEmail: "outsider@example.com" },
    ]) {
      let denied = false;
      handler({ user, deny() { denied = true; return undefined; } });
      assert.equal(denied, true);
    }
  });
  test(`${eventName} allows approved accounts`, () => {
    handler({ user: { id: "test", email: "sharmahimanshuprince@gmail.com" }, deny() { assert.fail("Approved account was denied"); } });
  });
}
