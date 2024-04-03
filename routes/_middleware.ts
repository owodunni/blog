/// <reference lib="deno.unstable" />
import { FreshContext } from "$fresh/server.ts";

const cacheRoutes = ["/posts", "/posts/:slug"];

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  if (!req.headers.get("Accept")?.includes("text/html")) return ctx.next();
  if (!cacheRoutes.includes(ctx.route)) return ctx.next();

  const kv = await Deno.openKv();
  let resp = (await kv.get<{ body: string; headers: Record<string, string> }>([
    ctx.url.href,
  ])).value;

  if (resp) {
    return new Response(resp.body, { headers: resp.headers, status: 200 });
  }

  const result = await ctx.next();

  const reader = result.body?.getReader();

  resp = {
    body: new TextDecoder().decode(
      (await reader?.read())?.value || new Uint8Array(),
    ),
    headers: Object.fromEntries(result.headers.entries()),
  };

  if (result.status === 200) {
    await kv.set([ctx.url.href], resp);
  }

  reader?.releaseLock();

  return new Response(resp.body, {
    headers: resp.headers,
    status: result.status,
  });
}
