import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { ActionCtx } from "./_generated/server";
import { authController } from "./controllers/authController";

const app: HonoWithConvex<ActionCtx> = new Hono();

app.route("/.well-known", authController);

app.use(
  "/api/upload-url",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Content-Type, Digest"],
    allowMethods: ["POST", "OPTIONS"],
  }),
);

app.post("/api/upload-url", async (ctx) => {
  const uploadUrl = await ctx.env.storage.generateUploadUrl();
  console.log("uploadUrl", uploadUrl);
  return new Response(JSON.stringify({ uploadUrl }), {
    status: 200,
  });
});

export default new HttpRouterWithHono(app);
