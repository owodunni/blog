import { FreshContext } from "$fresh/server.ts";

const cacheRoutes = ["/posts", "/posts/:slug", "/"];

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  if (!req.headers.get("Accept")?.includes("text/html")) return ctx.next();
  if (!cacheRoutes.includes(ctx.route)) return ctx.next();

  const result = await ctx.next();
  result.headers.set("Cache-control", "max-age=300");

  const reader = result.body?.getReader();

  const resp = {
    body: new TextDecoder().decode(
      (await reader?.read())?.value || new Uint8Array(),
    ),
    headers: Object.fromEntries(result.headers.entries()),
  };

  const cssResp = await fetch("http://localhost:3000/styles.css");

  const css = await cssResp.text();

  resp.body = resp.body.replace(
    `<link rel="stylesheet" href="/styles.css"/>`,
    `<style>${css}</style>`,
  );

  reader?.releaseLock();

  return new Response(resp.body, {
    headers: resp.headers,
    status: result.status,
  });
}
