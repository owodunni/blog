import type { Handle } from '@sveltejs/kit';
import TTLCache from '@isaacs/ttlcache';

const cache = new TTLCache({ max: 10000, ttl: 60 * 1000, noUpdateTTL: true });

const isDev = import.meta.env.DEV;

export const handle: Handle = async ({ event, resolve }) => {
  const { url } = event;

  const params = {
    filterSerializedResponseHeaders: (key: string) => {
      return key.toLowerCase() === 'content-type';
    }
  };

  // Create a unique key to store the page in the
  // cache. I'm using "rendered" to differentiate
  // entries from other data in Redis and the "v1"
  // will allow invalidating the entire cache if
  // the application code will change rendering.
  // For a blog, I don't want to alter the cache
  // on every querystring parameter otherwise it
  // reduces the cache hit-rate due to parameters
  // other sites may add (such as "fbclid").
  const key = `rendered:${url.pathname}:${url.searchParams}`;

  // ideally this is the only network request that
  // we make ... it will return an empty object if
  // the page wasn't cached or a populated object
  // containing body and headers
  let cached = cache.get<{ body: string; [k: string]: string }>(key);
  if (!cached?.body) {
    // if it wasn't cached, we render the pages
    const response = await resolve(event, params);

    // then convert it into a cachable object
    cached = { body: await response.text(), ...Object.fromEntries(response.headers.entries()) };

    if (response.status === 200) {
      // and write it to the Redis cache ...
      // NOTE: although this returns a promise
      // we don't await it, so we don't delay
      // returning the response to the client
      // (the cache write is "fire and forget")
      if (!isDev) cache.set(key, cached);
    }
  }

  const { body, ...headers } = cached;
  if (!isDev && !headers['Cache-Control']) headers['Cache-Control'] = 'max-age:60000';
  return new Response(body, { headers: new Headers(headers) });
};
