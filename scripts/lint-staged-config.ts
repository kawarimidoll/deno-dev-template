import { parse } from "std/jsonc/parse.ts";
import { mapValues } from "std/collections/map_values.ts";

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

const config = json["lint-staged"];
if (!config || typeof config !== "object" || Array.isArray(config)) {
  console.log("{}");
  Deno.exit(0);
}

const scripts = mapValues(config, (value: unknown) => `bash -c "${value}"`);
console.log(JSON.stringify(scripts));
