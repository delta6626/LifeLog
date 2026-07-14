import { Entry } from "./Entry";

export type EntryMetaData = Pick<
  Entry,
  | "id"
  | "title"
  | "preview"
  | "wordCount"
  | "isFavorite"
  | "createdAt"
  | "updatedAt"
>;
