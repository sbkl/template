import { Email } from "@convex-dev/auth/providers/Email";
import { ConvexError } from "convex/values";
import { alphabet, generateRandomString } from "oslo/crypto";
import { Resend as ResendAPI } from "resend";

import { env } from "../env";

export const ResendOTP = Email({
  id: "resend-otp",
  apiKey: env.AUTH_RESEND_KEY,
  maxAge: 60 * 15, // 15 minutes
  async generateVerificationToken() {
    return generateRandomString(8, alphabet("0-9"));
  },
  async sendVerificationRequest({ identifier: email, provider, token }) {
    const resend = new ResendAPI(provider.apiKey);
    const { error } = await resend.emails.send({
      from: `Template <${env.SENDER_EMAIL}>`,
      to: [email],
      subject: `Sign in to Template`,
      text: "Your code is " + token,
    });

    if (error) {
      throw new ConvexError(JSON.stringify(error));
    }
  },
});
