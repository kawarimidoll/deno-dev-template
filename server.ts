/// <reference path="./deploy.d.ts" />

const listener = Deno.listen({ port: 8080 });
console.log(`HTTP server listening on http://localhost:${listener.addr.port}`);

async function handleConn(conn: Deno.Conn) {
  const httpConn = Deno.serveHttp(conn);
  for await (const e of httpConn) {
    e.respondWith(handler(e.request, conn));
  }
}

async function handler(request: Request, conn: Deno.Conn) {
  if (request.url.includes("favicon")) {
    return new Response("ok");
  }

  const readme = await Deno.readTextFile("./README.md");

  return new Response(readme, {
    headers: {
      "x-localaddr": `${conn.localAddr.hostname}:${conn.localAddr.port}`,
      "x-remoteaddr": `${conn.remoteAddr.hostname}:${conn.remoteAddr.port}`,
    },
  });
}

for await (const conn of listener) {
  handleConn(conn);
}
