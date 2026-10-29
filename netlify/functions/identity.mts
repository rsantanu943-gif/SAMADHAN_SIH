import type { UserValidateEvent, UserSignupEvent, UserLoginEvent, UserModifiedEvent } from "@netlify/functions";
import { isApprovedEmail } from "../../lib/auth/approved-emails.ts";

function restrictAccess(event: UserValidateEvent | UserSignupEvent | UserLoginEvent | UserModifiedEvent) {
  if (!isApprovedEmail(event.user.email) || (event.user.pendingEmail && !isApprovedEmail(event.user.pendingEmail))) return event.deny();
}

const handlers = {
  userValidate: restrictAccess,
  userSignup: restrictAccess,
  userLogin: restrictAccess,
  userModified: restrictAccess,
};

export default handlers;
