import * as SC from "@effect/schema/Schema";
import type { APIRoute } from "astro";
import { Schema } from "@effect/schema";
import { Effect } from "effect";
import { UserServiceMock } from "../../server/UserService";

export const prerender = false;

const loginUser = () =>
  Effect.gen(function* (_) {
    return {};
  });

const loginFormSchema = Schema.struct({
  username: Schema.string,
  password: Schema.string,
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const handle = Effect.tryPromise(() => request.formData()).pipe(
    Effect.flatMap((data) => {
      const username = data.get("username");
      const password = data.get("password");
      return SC.validate(loginFormSchema)({ username, password });
    }),
    Effect.flatMap(() => loginUser()),

    Effect.map(() => {
      // set cookies
      cookies.set("session", "1234");
      return new Response(JSON.stringify({ message: "You're logged in!" }), {
        status: 200,
      });
    }),
    Effect.match({
      onSuccess(response) {
        console.log("Login successful");
        return response;
      },
      onFailure(cause) {
        console.error("Login failure", cause);
        switch (cause._tag) {
          case "ParseError":
            return new Response(JSON.stringify({ message: cause.message }), {
              status: 400,
            });

          default:
            return new Response(
              JSON.stringify({ message: "An unexpected error occurred" }),
              { status: 500 }
            );
        }
      },
    })
  );
  return Effect.runPromise(handle.pipe(Effect.provide(UserServiceMock)));
};

export const GET: APIRoute = async ({ request }) => {
  return Response.redirect(new URL("/login", request.url));
};
