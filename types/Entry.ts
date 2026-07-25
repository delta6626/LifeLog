export interface Entry {
  id: string;

  title: string;
  content: string;
  preview: string;
  wordCount: number;
  isFavorite: boolean;

  createdAt: EpochTimeStamp; // Milliseconds since UNIX epoch
  updatedAt: EpochTimeStamp; // Milliseconds since UNIX epoch
}
