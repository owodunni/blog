import { Handlers, PageProps } from "$fresh/server.ts";
import { readItems } from "@directus/sdk";
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

    return ctx.render({
      posts: await Promise.all(data.map((post) => toPost(post))),
    });
  },
};

export default function Posts({ data }: PageProps<Posts>) {
  return (
    <main>
      <article>
        <ul className="flex flex-col space-y-m">
          {data.posts.map(({ slug, title }) => (
            <li>
              <p className="text-heading-light">
                <a className="underline" href={`/posts/${slug}`}>{title}</a>
              </p>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
