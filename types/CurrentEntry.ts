import { Entry } from "./Entry";

export type CurrentEntry = Pick<
  Entry,
  "id" | "title" | "content" | "isFavorite" | "updatedAt"
>;
