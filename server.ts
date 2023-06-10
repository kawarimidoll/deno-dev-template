import { ConnInfo, serve } from "std/http/server.ts";

type NetConnInfo = ConnInfo & {
  localAddr: Deno.NetAddr;
  remoteAddr: Deno.NetAddr;
};

const port = 8080;
if (!Deno.env.get("DENO_DEPLOYMENT_ID")) {
  console.log(`HTTP server listening on http://localhost:${port}`);
}

serve(async (request: Request, conn: ConnInfo) => {
  const { href, origin, host, pathname, hash, search } = new URL(request.url);
  console.log({ href, origin, host, pathname, hash, search });
  if (pathname === "/favicon.ico") {
    return new Response("", { headers: { "content-type": "text/plain" } });
  }

  const readme = await Deno.readTextFile("./README.md");

  const { localAddr, remoteAddr } = conn as NetConnInfo;

  return new Response(readme, {
    headers: {
      "x-local-addr": `${localAddr.hostname}:${localAddr.port}`,
      "x-remote-addr": `${remoteAddr.hostname}:${remoteAddr.port}`,
    },
  });
}, { port });
