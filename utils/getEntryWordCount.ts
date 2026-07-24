export const getEntryWordCount = (plainTextContent: string) => {
  const wordCount = plainTextContent.match(/\S+/g)?.length ?? 0;
  return wordCount;
};
