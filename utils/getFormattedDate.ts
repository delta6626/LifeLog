export const getFormattedDate = (timestamp: EpochTimeStamp): string => {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(timestamp));
};
