import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  return resolve(event, {
    filterSerializedResponseHeaders: (key) => {
      return key.toLowerCase() === 'content-type';
    }
  });
};
