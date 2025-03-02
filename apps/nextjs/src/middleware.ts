import { NextResponse } from "next/server";
import {
  convexAuthNextjsMiddleware,
  // createRouteMatcher,
  // nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

// const isSignInPage = createRouteMatcher(["/auth/sign-in"]);
// const isProtectedRoute = createRouteMatcher(["/", "/chats(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const url = request.nextUrl;

  let hostname = request.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  const searchParams = request.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  const isAuthenticated = await convexAuth.isAuthenticated();
  // rewrites for app pages
  if (hostname == `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    if (!isAuthenticated && !path.startsWith("/auth/")) {
      const signInUrl = new URL("/auth/sign-in", request.url);
      signInUrl.searchParams.set("back", path);
      return NextResponse.redirect(signInUrl);
    } else if (isAuthenticated && path == "/auth/sign-in") {
      const backPath = url.searchParams.get("back");
      if (backPath && !backPath.startsWith("/auth/")) {
        return NextResponse.redirect(new URL(backPath, request.url));
      }
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (path === "/") {
      return NextResponse.redirect(new URL("/redirecting", request.url));
    }
    return NextResponse.rewrite(new URL(`/app${path}`, request.url));
  }

  // rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    hostname === `www.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
  ) {
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, request.url),
    );
  }

  // rewrite everything else to `/[domain]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, request.url));
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
