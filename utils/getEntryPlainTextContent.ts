export const getEntryPlainTextContent = (htmlContent: string) => {
  const plainTextContent = htmlContent
    .replace(/<[^>]*>/g, " ") // Strip HTML tags to get raw content
    .replace(/&nbsp;/g, " "); // Replace HTML non-breaking spaces with standard spaces

  return plainTextContent;
};
