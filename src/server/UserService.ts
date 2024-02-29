import { Context, Data, Effect, Layer } from "effect";
import { Argon2id } from "oslo/password";

export class UserNotFound extends Data.TaggedError("UserNotFound")<{
  username: string;
}> {
  static make(username: string) {
    return new UserNotFound({ username });
  }
}

export class InvalidPassword extends Data.TaggedError("InvalidPassword")<{
  username: string;
}> {
  static make(username: string) {
    return new InvalidPassword({ username });
  }
}

export class UnexpectedError extends Data.TaggedError("UnexpectedError")<{
  cause: unknown;
}> {
  static make(cause: unknown) {
    return new UnexpectedError({ cause });
  }
  override toString(): string {
    return `UnexpectedError: ${this.cause}`;
  }
}

interface RegularUser {
  id: string;
  username: string;
  role: "user" | "guest";
}

interface AdminUser {
  id: string;
  username: string;
  role: "admin";
}

export type User = RegularUser | AdminUser;

export class UserService extends Context.Tag("@boda/user-service")<
  UserService,
  {
    login: (
      username: string,
      password: string
    ) => Effect.Effect<User, UnexpectedError | UserNotFound | InvalidPassword>;
    register: (
      username: string,
      password: string
    ) => Effect.Effect<RegularUser, UnexpectedError>;
    registerAdmin: (
      username: string,
      password: string
    ) => Effect.Effect<AdminUser, UnexpectedError>;
  }
>() {}

export const UserServiceMock = Layer.succeed(
  UserService,
  UserService.of({
    register: (_username, _password) =>
      Effect.fail(UnexpectedError.make("Not implemented" as const)),
    registerAdmin: (_username, _password) =>
      Effect.fail(UnexpectedError.make("Not implemented" as const)),
    login: (username, password) => {
      if (username === "admin" && password === "admin") {
        return Effect.succeed({ username, role: "admin", id: "123" });
      }
      if (username === "user" && password === "user") {
        return Effect.succeed({ username, role: "user", id: "123" });
      }
      return Effect.fail(UserNotFound.make(username));
    },
  })
);

export const verifyPassword = (password: string, hash: string) => {
  return Effect.tryPromise({
    try: async () => {
      return new Argon2id().verify(hash, password);
    },
    catch: UnexpectedError.make,
  }).pipe(
    Effect.flatMap((status) =>
      status
        ? Effect.succeed(status)
        : Effect.fail(InvalidPassword.make("Invalid password" as const))
    )
  );
};
