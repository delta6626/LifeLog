export interface Entry {
  id: string;

  title: string;
  content: string;
  preview: string;
  wordCount: number;
  isFavorite: boolean;

  createdAt: EpochTimeStamp;
  updatedAt: EpochTimeStamp;
}
