import { parse } from "https://deno.land/std/jsonc/parse.ts";
import { mapValues } from "https://deno.land/std/collections/map_values.ts";
import lintStaged from "npm:lint-staged";

const readJsonc = async (filename: string) => {
  try {
    return parse(await Deno.readTextFile(filename));
  } catch (e) {
    console.error(e.message);
  }
};

const json = await readJsonc("./deno.jsonc") || await readJsonc("./deno.json");

if (!json || typeof json !== "object" || Array.isArray(json)) {
  console.error("Valid deno configuration file is required");
  Deno.exit(1);
}

const lintConfig = json["lint-staged"];
if (
  !lintConfig || typeof lintConfig !== "object" || Array.isArray(lintConfig)
) {
  console.log({});
  Deno.exit(0);
}

const config = mapValues(lintConfig, (value: unknown) => `bash -c "${value}"`);

try {
  const success = await lintStaged({ config });
  if (success) {
    console.log("Linting was successful!");
    Deno.exit(0);
  } else {
    console.error("Linting failed!");
    Deno.exit(1);
  }
} catch (e) {
  // Failed to load configuration
  console.error(e);
  Deno.exit(1);
}
