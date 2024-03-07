import type { PageServerLoad } from './$types';
import { directus } from '$lib/api';
import { readItems } from '@directus/sdk';
import { toPost } from '$lib/api/transform';

export const load: PageServerLoad = async ({ fetch }) => {
  const client = directus(fetch);

  const data = await client.request(readItems('posts', {}));

  return { posts: data.map(toPost) };
};
