import { readItems } from "npm:@directus/sdk";
import { directus } from "../../lib/api/index.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { toPost } from "../../lib/api/transform.ts";
import { Post } from "../../lib/api/types.ts";
import { marked } from "npm:marked";

export const handler: Handlers<{ post: Post }> = {
  async GET(_req, ctx) {
    const client = directus(fetch);

    const slug = ctx.params.slug;

    const data = await client.request(
      readItems("posts", { filter: { slug: { _eq: slug } } }),
    );

    const post = data[0];
    if (!post) {
      return Response.json({
        status: 404,
        error: `Could not find a post for slug '${slug}'`,
      }, { status: 404 });
    }

    return ctx.render({
      post: toPost(
        post,
        (content) => marked.parse(content, { async: false }) as string,
      ),
    });
  },
};

export default function Post({ data }: PageProps<{ post: Post }>) {
  return (
    <main>
      <h1>{data.post.title}</h1>
      <article dangerouslySetInnerHTML={{ __html: data.post.content }} />
    </main>
  );
}
