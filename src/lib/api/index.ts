import { createDirectus, rest, type FetchInterface, staticToken } from '@directus/sdk';
import { env } from '$env/dynamic/private';
import type { BlogSchema } from './types';

export function directus(fetch: FetchInterface) {
  return createDirectus<BlogSchema>(env.SECRET_CMS_URL, { globals: { fetch } })
    .with(staticToken(env.SECRET_CMS_API_KEY))
    .with(rest());
}
