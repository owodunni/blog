import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async () => {
  return { message: 'Hello world' };
};
