import { createDirectus, rest, type FetchInterface, staticToken } from '@directus/sdk';
import { SECRET_CMS_URL, SECRET_CMS_API_KEY } from '$env/static/private';
import type { BlogSchema } from './types';

export function directus(fetch: FetchInterface) {
  console.log(SECRET_CMS_URL);
  return createDirectus<BlogSchema>(SECRET_CMS_URL, { globals: { fetch } })
    .with(staticToken(SECRET_CMS_API_KEY))
    .with(rest());
}
