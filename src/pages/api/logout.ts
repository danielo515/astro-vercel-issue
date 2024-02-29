import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ locals }) => {
  if (!locals.session) {
    return new Response(null, {
      status: 401,
    });
  }

  return Astro.redirect("/");
};
