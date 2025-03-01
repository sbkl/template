/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as controllers_authController from "../controllers/authController.js";
import type * as emails_resendOTP from "../emails/resendOTP.js";
import type * as env from "../env.js";
import type * as functions from "../functions.js";
import type * as http from "../http.js";
import type * as types_index from "../types/index.js";
import type * as users_utils from "../users/utils.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "controllers/authController": typeof controllers_authController;
  "emails/resendOTP": typeof emails_resendOTP;
  env: typeof env;
  functions: typeof functions;
  http: typeof http;
  "types/index": typeof types_index;
  "users/utils": typeof users_utils;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
