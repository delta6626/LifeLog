import { File, Paths } from "expo-file-system";
import { EntryMetaData } from "../types/EntryMetaData";

const META_DATA_FILE_NAME = "metadata.json";
const ENTRIES_DIRECTORY = "entries";

const createMetaDataFile = () => {
  // Creates a new JSON file for storing meta data of all entries and populates it with an empty object

  const file = new File(Paths.document, META_DATA_FILE_NAME);
  file.create();
  file.write("{}");
};

export const getAllEntriesMetaData = async (): Promise<EntryMetaData[]> => {
  const file = new File(Paths.document, META_DATA_FILE_NAME);

  if (!file.exists) {
    createMetaDataFile();
    return [];
  }

  const fileContentsUnparsed = await file.text();
  const parsedEntriesMetaData = JSON.parse(
    fileContentsUnparsed,
  ) as EntryMetaData[];

  return parsedEntriesMetaData;
};
