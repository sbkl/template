import { Id } from "../_generated/dataModel";
import { ActionCtx } from "../_generated/server";

declare module "hono" {
  interface ContextVariableMap {
    user: Doc<"users">;
  }
}
