export interface EntryMetaData {
  id: string;

  title: string;
  preview: string;
  wordCount: number;
  isFavorite: boolean;

  createdAt: EpochTimeStamp;
  updatedAt: EpochTimeStamp;
}
