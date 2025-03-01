import { CustomCtx } from "convex-helpers/server/customFunctions";
import { Env, ValidationTargets } from "hono";

import { Doc } from "../_generated/dataModel";
import { ActionCtx } from "../_generated/server";
import {
  internalAction,
  internalMutation,
  protectedMutation,
  protectedQuery,
  publicMutation,
  publicQuery,
} from "../functions";

export type PublicQueryCtx = CustomCtx<typeof publicQuery>;
export type PublicMutationCtx = CustomCtx<typeof publicMutation>;
export type InternalMutationCtx = CustomCtx<typeof internalMutation>;
export type InternalActionCtx = CustomCtx<typeof internalAction>;

export type ProtectedQueryCtx = CustomCtx<typeof protectedQuery>;
export type ProtectedMutationCtx = CustomCtx<typeof protectedMutation>;

export type ActionContext = {
  Bindings: ActionCtx & Env;
  Variables: {
    user: Doc<"users">;
  };
  ValidationTargets: ValidationTargets;
};
