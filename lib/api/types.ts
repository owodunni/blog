type UUID = string;
/**
 * {@ref ISODate} is a (ISO 8601)[https://en.wikipedia.org/wiki/ISO_8601] date string.
 */
type ISODate = string;
type Status = "draft" | "published";

export interface PostSchema {
  id: number;
  status: Status;
  user_created: UUID;
  date_created: ISODate;
  user_updated: null | UUID;
  date_updated: null | ISODate;
  Title: string;
  content: string;
  slug: string;
}

export type Post =
  & Omit<
    PostSchema,
    "user_created" | "date_created" | "user_updated" | "date_updated" | "Title"
  >
  & {
    user: PostSchema["user_created"];
    created: PostSchema["user_created"];
    modified: Required<PostSchema["user_updated"]>;
    title: PostSchema["Title"];
  };

export interface BlogSchema {
  // regular collections are array types
  posts: PostSchema[];
}
