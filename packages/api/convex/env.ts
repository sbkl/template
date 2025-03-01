import { z } from "zod";

function requireEnv() {
  return {
    AUTH_RESEND_KEY: z.string().parse(process.env.AUTH_RESEND_KEY, {
      path: ["AUTH_RESEND_KEY"],
    }),
    CONVEX_SITE_URL: z.string().parse(process.env.CONVEX_SITE_URL, {
      path: ["CONVEX_SITE_URL"],
    }),
    JWKS: z.string().parse(process.env.JWKS, {
      path: ["JWKS"],
    }),
    JWT_SECRET: z.string().parse(process.env.JWT_SECRET, {
      path: ["JWT_SECRET"],
    }),
    MEDIA_URL: z
      .string()
      .url()
      .parse(process.env.MEDIA_URL, {
        path: ["MEDIA_URL"],
      }),
    PROTOCOL: z.string().parse(process.env.PROTOCOL, {
      path: ["PROTOCOL"],
    }),
    SENDER_EMAIL: z.string().parse(process.env.SENDER_EMAIL, {
      path: ["SENDER_EMAIL"],
    }),
    SITE_DOMAIN: z.string().parse(process.env.SITE_DOMAIN, {
      path: ["SITE_DOMAIN"],
    }),
    SITE_URL: z.string().parse(process.env.SITE_URL, {
      path: ["SITE_URL"],
    }),
  };
}

export const env = requireEnv();
