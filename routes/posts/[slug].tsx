import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, ctx) {
    const slug = ctx.params.slug;
    return new Response("", {
      status: 308,
      headers: { Location: `/${slug}` },
    });
  },
};
