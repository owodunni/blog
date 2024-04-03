/// <reference lib="deno.unstable" />
import { FreshContext } from "$fresh/server.ts";

const cacheRoutes = ["/posts", "/posts/:slug"];

const cache = new Map<
  string,
  { body: string; headers: Record<string, string> }
>();

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  if (!req.headers.get("Accept")?.includes("text/html")) return ctx.next();
  if (!cacheRoutes.includes(ctx.route)) return ctx.next();

  let resp = cache.get(ctx.url.href);
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
    cache.set(ctx.url.href, resp);
  }

  reader?.releaseLock();

  return new Response(resp.body, {
    headers: resp.headers,
    status: result.status,
  });
}
