import type { Post, PostSchema } from "./types.ts";

export async function toPost(
  post: PostSchema,
  transform?: (markdown: string) => Promise<string>,
): Promise<Post> {
  return {
    title: post.Title,
    content: transform && typeof transform === "function"
      ? await transform(post.content)
      : post.content,
    user: post.user_created,
    created: post.date_created,
    modified: post.date_updated ?? post.date_created,
    slug: post.slug,
    id: post.id,
    status: post.status,
    summary: post.summary,
  };
}
