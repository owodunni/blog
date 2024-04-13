import { readItems } from "@directus/sdk";
import { directus } from "../../lib/api/index.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import { toPost } from "../../lib/api/transform.ts";
import type { Post } from "../../lib/api/types.ts";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js/lib/common";
import { Head } from "$fresh/runtime.ts";
import { join } from "$std/path/join.ts";

// Override function
const markedOptions = markedHighlight({
  langPrefix: "hljs language-",
  highlight(code: string, lang: string) {
    const language = hljs.getLanguage(lang) ? lang : "plaintext";
    return hljs.highlight(code, { language }).value;
  },
});

const marked = new Marked(markedOptions);

// Override function
const renderer = {
  image(href: string, title: string, text: string) {
    const width = 1000;
    const height = 600;
    return `<picture>
    ${calculateSourceSet({href, width, height}).map(({type, srcset})=>`<source type=${type} srcset="${srcset}" sizes=${width}px />`).join('')}
    <img
      width=${width}
      height=${height}
      src=${getAsset2(href, { width, height, format: "jpg", quality: 80 })}
      loading="lazy"
      decoding="async"
      alt=${text}
      ${title ? `title=${title}` : ''}
    />
  </picture>`
  },
};

marked.use({ renderer });

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
      post: await toPost(
        post,
        (content) => marked.parse(content, { async: true }) as Promise<string>,
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

type Format = "avif" | "webp" | "jpg";
type ImageType = "image/avif" | "image/webp" | "image/jpeg";

const allowedSized = [64, 100, 112, 200, 250, 400, 450, 627, 800, 1000, 1200];

// Find first value in allowedSized that is smaller or equal to size
function findSize(size: number): number {
  for (let i = 0; i < allowedSized.length; i++) {
    if (allowedSized[i] >= size) {
      return allowedSized[i];
    }
  }
  return allowedSized[allowedSized.length - 1];
}

function calculateSourceSet({href, width, height}:{href: string, width: number, height: number}): { type: ImageType; srcset: string }[] {
  const scales = [1, 0.75, 0.5, 0.25];
  const formats = [
    { format: "webp", name: "image/webp" },
    { format: "avif", name: "image/avif" },
    { name: "image/jpeg", format: "jpg" }
  ] as const satisfies readonly { readonly format: Format; readonly name: ImageType }[];

  return formats.map(({ format, name }) => ({
    type: name,
    srcset: scales
      .map((scale) => {
        const aspectRatio = width / height;
        const w = findSize(scale * width);
        const h = findSize(w / aspectRatio);
        const src = getAsset2(href, { width: w, height: h, format, quality: 0.8 });
        return `${src} ${width}w`;
      })
      .join(",")
  }));
}

function getAsset2(
  href: string,
  {
    width,
    height,
    quality,
    format
  }: { width: number; height: number; quality: number; format: "png" | "jpg" | "avif" | "webp" }
): string {
  return `${href}?width=${width}&height=${height}&quality=${quality}&format=${format}`;
}
