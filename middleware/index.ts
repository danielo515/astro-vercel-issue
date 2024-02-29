import { defineMiddleware } from "astro/middleware";
const PUBLIC_ROUTES = ["/", "/login"];

export const authorize = defineMiddleware(async (context, next) => {
  // Ignore auth validation for public routes
  if (PUBLIC_ROUTES.includes(context.url.pathname)) {
    return next();
  }

  if (!context.locals.user) {
    if (context.url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ message: "unauthorized" }), {
        status: 401,
      });
    }
    // otherwise, redirect to the root page for the user to login

    return Response.redirect(new URL("/", context.url));
  }
  return next();
});
