import { ConnInfo, serve } from "https://deno.land/std@0.114.0/http/server.ts";

function isNetAddr(addr: Deno.Addr): addr is Deno.NetAddr {
  return Object.hasOwn(addr, "hostname");
}

const addr = ":8080";
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  console.log(`HTTP server listening on http://localhost${addr}`);
}

await serve(async (request: Request, conn: ConnInfo) => {
  const { href, origin, host, pathname, hash, search } = new URL(request.url);
  console.log({ href, origin, host, pathname, hash, search });

  const readme = await Deno.readTextFile("./README.md");

  const { localAddr, remoteAddr } = conn;
  if (!isNetAddr(localAddr) || !isNetAddr(remoteAddr)) {
    throw new Error("not net addr");
  }

  return new Response(readme, {
    headers: {
      "x-local-addr": `${localAddr.hostname}:${localAddr.port}`,
      "x-remote-addr": `${remoteAddr.hostname}:${remoteAddr.port}`,
    },
  });
}, { addr });
