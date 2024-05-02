import { Handlers, PageProps } from "$fresh/server.ts";
import { directus } from "../lib/api/index.ts";
import { toPost } from "../lib/api/transform.ts";
import { Post } from "../lib/api/types.ts";
import { readItems } from "@directus/sdk";

export type Posts = { posts: Post[] };

export const handler: Handlers<Posts> = {
  async GET(_req, ctx) {
    const client = directus(fetch);

    const data = await client.request(
      readItems("posts", {
        filter: { status: { _eq: "published" } },
        sort: "-date_updated",
      }),
    );

    return ctx.render({
      posts: await Promise.all(data.map((post) => toPost(post))),
    });
  },
};

export default function Home({ data }: PageProps<Posts>) {
  return (
    <main className="mx-auto max-w-2xl ">
      <header>
        <h1 className="text-display2-light sm:text-display1-light dark:text-slate-300 text-zinc-700">
          Alexander Poole Jardén
        </h1>
        <div className="flex space-x-m items-center py-m">
          <a href="https://assets.jardoole.xyz/assets/9ad55473-d36d-4613-a4b5-e5219dc4caac.jpg">
            <img
              src={"https://assets.jardoole.xyz/assets/9ad55473-d36d-4613-a4b5-e5219dc4caac.jpg?width=200&height=200&quality=0.8&format=webp"}
              className="w-28 h-28 rounded-full"
            />
          </a>
          <p className="text-body-light dark:text-slate-300 text-zinc-700">
            A developer from Sweden.
          </p>
        </div>
      </header>
      <article className="article">
        <p>
          This blog is a learning experience. For the longest time I have been
          meaning to improve my writing. By focusing on quantity and not quality
          I hope to become a better writier.
        </p>
        <p>
          When improving a skill most of the gain comes from the first 80% of
          progress, while most of the time goes into the last 20% percent. This
          blog is a homage to those first 80%.
        </p>
        <p>
          I plan to improve this website one hastily writen blog post at a time.
          And hopefully I might just become a better writer in the process.
        </p>
      </article>
      <ul className="flex flex-col space-y-m">
        {data.posts.map((post) => (
          <li>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </main>
  );
}

function PostCard(
  { post: { modified, title, slug, summary } }: { post: Post },
) {
  const date = new Date(modified).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });
  return (
    <article className="relative flex flex-col items-center p-m border rounded border-stone-400 dark:border-slate-600">
      <header className="flex flex-col items-center">
        <time dateTime={modified}>
          {date}
        </time>
        <h2 className="text-titleC-light">{title}</h2>
      </header>
      {summary && summary.length > 10 && (
        <p className="text-body-light mt-l px-m">{summary}</p>
      )}
      <a
        href={`/${slug}`}
        aria-label={`Post: ${title}, ${date}`}
        className="absolute inset-0 z-10"
      >
      </a>
    </article>
  );
}
