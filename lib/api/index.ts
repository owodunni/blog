import {
  createDirectus,
  type FetchInterface,
  rest,
  staticToken,
} from "npm:@directus/sdk";
import type { BlogSchema } from "./types";
import { load } from "https://deno.land/std@0.220.0/dotenv/mod.ts";

const env = await load();

const { SECRET_CMS_URL, SECRET_CMS_API_KEY } = env;

export function directus(fetch: FetchInterface) {
  if (d) return d;
  d = createDirectus<BlogSchema>(SECRET_CMS_URL, { globals: { fetch } })
    .with(staticToken(SECRET_CMS_API_KEY))
    .with(rest());
  return d;
}

let d: ReturnType<typeof createDirectus> | undefined;
