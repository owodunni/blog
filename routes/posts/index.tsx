import { Handlers, PageProps } from "$fresh/server.ts";
import { readItems } from "npm:@directus/sdk";
import { directus } from "../../lib/api/index.ts";
import { toPost } from "../../lib/api/transform.ts";
import type { Post } from "../../lib/api/types.ts";

export type Posts = { posts: Post[] };

export const handler: Handlers<Posts> = {
  async GET(_req, ctx) {
    const client = directus(fetch);

    const data = await client.request(
      readItems("posts", { filter: { status: { _eq: "published" } } }),
    );

    return ctx.render({ posts: data.map(toPost) });
  },
};

export default function Posts({ data }: PageProps<Posts>) {
  return (
    <main>
      <h1>Posts</h1>
      <article>
        <ul>
          {data.posts.map(({ slug, title }) => (
            <li>
              <p>
                <a href={`/posts/${slug}`}>{title}</a>
              </p>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
