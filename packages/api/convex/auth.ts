import { convexAuth } from "@convex-dev/auth/server";
import { ResendOTP } from "./emails/resendOTP";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [ResendOTP],
});
