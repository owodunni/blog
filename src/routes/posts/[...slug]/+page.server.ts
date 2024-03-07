import type { PageServerLoad } from './$types';
import { directus } from '$lib/api';
import { readItems } from '@directus/sdk';
import { error } from '@sveltejs/kit';
import { toPost } from '$lib/api/transform';

export const load: PageServerLoad = async ({ fetch, params: { slug } }) => {
  const client = directus(fetch);

  const data = await client.request(readItems('posts', { filter: { slug: { _eq: slug } } }));

  const post = data[0];
  if (!post) error(404, `Could not find a post for slug '${slug}'`);
  return { post: toPost(post) };
};
