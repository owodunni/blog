import type { Post, PostSchema } from './types';

export function toPost(post: PostSchema): Post {
  return {
    title: post.Title,
    content: post.content,
    user: post.user_created,
    created: post.user_created,
    modified: post.user_updated ?? post.user_created,
    slug: post.slug,
    id: post.id,
    status: post.status
  };
}
