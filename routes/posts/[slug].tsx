import { readItems } from "npm:@directus/sdk";
import { directus } from "../../lib/api/index.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { toPost } from "../../lib/api/transform.ts";
import type { Post } from "../../lib/api/types.ts";
import { Marked } from "npm:marked";
import { markedHighlight } from "npm:marked-highlight";
import hljs from "npm:highlight.js/lib/common";
import { Head } from "$fresh/runtime.ts";
import { join } from "$std/path/join.ts";

const marked = new Marked(
  markedHighlight({
    langPrefix: "hljs language-",
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : "plaintext";
      return hljs.highlight(code, { language }).value;
    },
  }),
);

const cssFile = join(Deno.cwd(), "static/atom-one-light.css");
let css = "";

export const handler: Handlers<{ post: Post; css: string }> = {
  async GET(_req, ctx) {
    const client = directus(fetch);

    css = css || await Deno.readTextFile(cssFile);

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
      css,
    });
  },
};

export default function Post({ data }: PageProps<{ post: Post; css: string }>) {
  const article = `<header>
<h1>${data.post.title}</h1>
</header>
${data.post.content}`;

  return (
    <>
      <Head>
        <style>{data.css}</style>
      </Head>
      <main>
        <article dangerouslySetInnerHTML={{ __html: article }} />
      </main>
    </>
  );
}
