import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";

export async function getCurrentUser(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
}

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new ConvexError("Authentication required");
  return userRecord;
}

export async function wipeUserAccount(ctx: MutationCtx, userId: Id<"users">) {
  const authAccount = await ctx.db
    .query("authAccounts")
    .withIndex("userIdAndProvider", (q) =>
      q.eq("userId", userId).eq("provider", "resend-otp")
    )
    .first();
  if (authAccount) {
    await ctx.db.delete(authAccount._id);
    const authVerificationCodes = await ctx.db
      .query("authVerificationCodes")
      .withIndex("accountId", (q) => q.eq("accountId", authAccount?._id))
      .collect();
    for (const authVerificationCode of authVerificationCodes) {
      await ctx.db.delete(authVerificationCode._id);
    }
  }
  const authSessions = await ctx.db
    .query("authSessions")
    .withIndex("userId", (q) => q.eq("userId", userId))
    .collect();

  for (const authSession of authSessions) {
    await ctx.db.delete(authSession._id);

    const authRefreshToken = await ctx.db
      .query("authRefreshTokens")
      .withIndex("sessionId", (q) => q.eq("sessionId", authSession._id))
      .collect();
    for (const refreshToken of authRefreshToken) {
      await ctx.db.delete(refreshToken._id);
    }

    const authVerifiers = await ctx.db
      .query("authVerifiers")
      .filter((q) => q.eq(q.field("sessionId"), authSession._id))
      .collect();
    for (const authVerifier of authVerifiers) {
      await ctx.db.delete(authVerifier._id);
    }
  }

  await ctx.db.delete(userId);
}
