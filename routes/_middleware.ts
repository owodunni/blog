/// <reference lib="deno.unstable" />
import { FreshContext } from "$fresh/server.ts";
import { load } from "$std/dotenv/mod.ts";

const { PROD } = await load();
const isDev = !!PROD;

const cacheRoutes = ["/posts", "/posts/:slug", "/"];

const cache = new Map<
  string,
  { body: string; headers: Record<string, string> }
>();

let css = "";

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  if (!req.headers.get("Accept")?.includes("text/html")) return ctx.next();
  if (!cacheRoutes.includes(ctx.route)) return ctx.next();

  if (!isDev) {
    const resp = cache.get(ctx.url.href);
    if (resp) {
      return new Response(resp.body, { headers: resp.headers, status: 200 });
    }
  }

  const result = await ctx.next();
  result.headers.set("Cache-control", "max-age=300");

  const reader = result.body?.getReader();

  const resp = {
    body: new TextDecoder().decode(
      (await reader?.read())?.value || new Uint8Array(),
    ),
    headers: Object.fromEntries(result.headers.entries()),
  };

  if (!isDev) {
    if (!css) {
      const cssResp = await fetch("http://localhost:3000/styles.css");

      css = await cssResp.text();
    }

    resp.body = resp.body.replace(
      `<link rel="stylesheet" href="/styles.css"/>`,
      `<style>${css}</style>`,
    );
  }

  if (result.status === 200) {
    cache.set(ctx.url.href, resp);
  }

  reader?.releaseLock();

  return new Response(resp.body, {
    headers: resp.headers,
    status: result.status,
  });
}
