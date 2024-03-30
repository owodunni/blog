import type { Post, PostSchema } from "./types.ts";

export function toPost(
  post: PostSchema,
  transform?: (markdown: string) => string,
): Post {
  return {
    title: post.Title,
    content: transform && typeof transform === "function"
      ? transform(post.content)
      : post.content,
    user: post.user_created,
    created: post.user_created,
    modified: post.user_updated ?? post.user_created,
    slug: post.slug,
    id: post.id,
    status: post.status,
  };
}
