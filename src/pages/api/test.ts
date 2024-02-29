import type { APIRoute } from "astro";
import type { Me } from "../../common-types/me";

export const prerender = false;
const adminPages = [{ path: "/alicia/invitados", title: "Invitados" }];
const guestPages = [{ path: "/gallery", title: "Galería" }];

// Gives information about the current user
export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response(JSON.stringify({ role: "anonymous" } satisfies Me), {
      status: 200,
    });
  }
  if (user.role === "admin") {
    return new Response(
      JSON.stringify({
        role: "admin",
        pages: [...adminPages, ...guestPages],
      } satisfies Me),
      {
        status: 200,
      }
    );
  }
  return new Response(
    JSON.stringify({ role: "user", pages: guestPages } satisfies Me),
    {
      status: 200,
    }
  );
};
