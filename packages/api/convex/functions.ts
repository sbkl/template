import { getAuthUserId } from "@convex-dev/auth/server";
import {
  customAction,
  CustomCtx,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import {
  Rules,
  wrapDatabaseReader,
  wrapDatabaseWriter,
} from "convex-helpers/server/rowLevelSecurity";
import { ConvexError } from "convex/values";

import { DataModel } from "./_generated/dataModel";
import {
  action as baseAction,
  internalAction as baseInternalAction,
  internalMutation as baseInternalMutation,
  internalQuery as baseInternalQuery,
  mutation as baseMutation,
  query as baseQuery,
  QueryCtx,
} from "./_generated/server";
import { getCurrentUser, getCurrentUserOrThrow } from "./users/utils";

async function rlsRules(ctx: QueryCtx) {
  const user = await getCurrentUserOrThrow(ctx);
  return {
    rules: {} satisfies Rules<QueryCtx, DataModel>,
    user,
  };
}

export const publicQuery = customQuery(
  baseQuery,
  customCtx(async (ctx) => {
    const user = await getCurrentUser(ctx);
    return {
      ...ctx,
      user,
    };
  }),
);

export const protectedQuery = customQuery(
  baseQuery,
  customCtx(async (ctx) => {
    const { rules, user } = await rlsRules(ctx);
    return {
      ...ctx,
      db: wrapDatabaseReader(ctx, ctx.db, rules),
      user,
    };
  }),
);

export const internalQuery = customQuery(
  baseInternalQuery,
  customCtx(async (ctx) => ({ ...ctx, userId: undefined })),
);

export const publicMutation = customMutation(
  baseMutation,
  customCtx(async (ctx) => {
    const user = await getCurrentUser(ctx);
    return {
      ...ctx,
      user,
    };
  }),
);

export const protectedMutation = customMutation(
  baseMutation,
  customCtx(async (ctx) => {
    const { rules, user } = await rlsRules(ctx);
    return {
      ...ctx,
      db: wrapDatabaseWriter(ctx, ctx.db, rules),
      user,
    };
  }),
);

export const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (ctx) => {
    return {
      ...ctx,
      user: undefined,
    };
  }),
);

export const publicAction = customAction(
  baseAction,
  customCtx(async (ctx) => ctx),
);

export const internalAction = customAction(
  baseInternalAction,
  customCtx(async (ctx) => ({ ...ctx, userId: undefined })),
);

export const protectedAction = customAction(
  baseAction,
  customCtx(async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new ConvexError("Authentication required");
    return {
      ...ctx,
      userId,
    };
  }),
);

export type PublicQueryCtx = CustomCtx<typeof publicQuery>;
export type PublicMutationCtx = CustomCtx<typeof publicMutation>;
export type InternalMutationCtx = CustomCtx<typeof internalMutation>;
export type InternalActionCtx = CustomCtx<typeof internalAction>;
