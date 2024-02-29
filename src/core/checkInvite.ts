import * as O from "fp-ts/lib/Option";
import * as A from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
interface User {
  id: string;
  username: string;
  email: string;
}

const compareKey =
  <T extends keyof User>(key: T, value: string) =>
  (invitado: User) =>
    invitado[key].toLocaleLowerCase() === value;

export default function checkInvite(
  invitados: User[],
  name: string
): O.Option<string> {
  const lowercaseName = name.toLocaleLowerCase();
  return pipe(
    invitados,
    A.findFirst(compareKey("username", lowercaseName)),
    O.alt(() =>
      pipe(invitados, A.findFirst(compareKey("email", lowercaseName)))
    ),
    O.map((invitado) => invitado.id)
  );
}
