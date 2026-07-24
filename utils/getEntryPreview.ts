export const getEntryPreview = (plainTextContent: string) => {
  const preview = plainTextContent.slice(0, 100).trim();
  return preview;
};
