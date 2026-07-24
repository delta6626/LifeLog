export const getEntryPlainTextContent = (htmlContent: string) => {
  const plainTextContent = htmlContent
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ");

  return plainTextContent;
};
