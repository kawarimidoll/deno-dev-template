// Thank you for https://github.com/Yakiyo/deno_hooks

import { parse } from "https://deno.land/std/jsonc/parse.ts";
import { exists } from "https://deno.land/std/fs/exists.ts";
import { join } from "https://deno.land/std/path/mod.ts";

const KNOWN_HOOKS = [
  "applypatch-msg",
  "commit-msg",
  "post-applypatch",
  "post-checkout",
  "post-commit",
  "post-merge",
  "post-rewrite",
  "post-update",
  "pre-applypatch",
  "pre-commit",
  "pre-merge-commit",
  "pre-push",
  "pre-rebase",
  "prepare-commit-msg",
  "push-to-checkout",
];

// type guard
type DenoJson = {
  tasks: Record<string, string>;
  hooks_dir?: string;
  [key: string]: unknown;
};
const isDenoJson = (json: unknown): json is DenoJson =>
  !!json && typeof json === "object" && Object.hasOwn(json, "tasks");

// load deno.json(c)
const filename = await exists("./deno.jsonc")
  ? "deno.jsonc"
  : await exists("./deno.json")
  ? "deno.json"
  : "";
if (!filename) {
  throw new Error("No deno configuration file found");
}

// parse deno.json(c)
const json = parse(await Deno.readTextFile(filename));
if (!isDenoJson(json)) {
  throw new Error(`'${filename}' must be a valid json file with 'tasks' key`);
}

const hooks_dir = json.hooks_dir || ".hooks";

// convert hooks to array of commands
const hooks = Object.entries(json.tasks)
  .filter(([hook]) => KNOWN_HOOKS.includes(hook))
  .map(([hook, script]) => ["add", join(hooks_dir, hook), script]);
hooks.unshift(["install", hooks_dir]);

// remove .hooks directory (for idempotency)
await (new Deno.Command("rm", { args: ["-rf", hooks_dir] })).output();

// define deno command variables
const cmd = "deno";
const baseArgs = [
  "run",
  "--allow-read",
  "--allow-run",
  "--allow-write",
  "https://deno.land/x/deno_hooks@0.1.1/mod.ts",
];
const decoder = new TextDecoder();

// setup hooks
for await (const hook of hooks) {
  console.log(">", hook.join(" "));
  const command = new Deno.Command(cmd, { args: [...baseArgs, ...hook] });

  const { code, stdout, stderr } = await command.output();

  if (code === 0) {
    console.info(decoder.decode(stdout));
  } else {
    console.error(decoder.decode(stderr));
  }
}
