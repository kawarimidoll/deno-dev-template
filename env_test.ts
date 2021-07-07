import { assert, assertThrows } from "./deps.ts";
import env from "./env.ts";

Deno.test("env", () => {
  assert(env("SAMPLE_TOKEN"));

  assertThrows(() => {
    env("NOT_EXIST_TOKEN");
  });
});
