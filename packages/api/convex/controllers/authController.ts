import { HonoWithConvex } from "convex-helpers/server/hono";
import { Hono } from "hono";

import { ActionCtx } from "../_generated/server";
import { env } from "../env";

const authController: HonoWithConvex<ActionCtx> = new Hono();

authController.get("/openid-configuration", async () => {
  return new Response(
    JSON.stringify({
      issuer: env.CONVEX_SITE_URL,
      jwks_uri: env.CONVEX_SITE_URL + "/.well-known/jwks.json",
      authorization_endpoint: env.CONVEX_SITE_URL + "/oauth/authorize",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control":
          "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
      },
    },
  );
});

authController.get("/jwks.json", async () => {
  return new Response(env.JWKS, {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control":
        "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
    },
  });
});

export { authController };
