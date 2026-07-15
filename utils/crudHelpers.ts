import { Directory, File, Paths } from "expo-file-system";
import { Entry } from "../types/Entry";
import { EntryMetaData } from "../types/EntryMetaData";

const META_DATA_FILE_NAME = "metadata.json";
const ENTRIES_DIRECTORY = "entries";

const createMetaDataFile = async () => {
  // Creates a new JSON file for storing meta data of all entries and populates it with an empty array
  const file = new File(Paths.document, META_DATA_FILE_NAME);

  if (!file.exists) {
    await file.create();
    await file.write("[]");
  }
};

export const getAllEntriesMetaData = async (): Promise<EntryMetaData[]> => {
  const file = new File(Paths.document, META_DATA_FILE_NAME);

  if (!file.exists) {
    await createMetaDataFile();
    return [];
  }

  const fileContentsUnparsed = await file.text();
  const parsedEntriesMetaData = JSON.parse(
    fileContentsUnparsed,
  ) as EntryMetaData[];

  return parsedEntriesMetaData;
};

export const addNewEntryMetaData = async (
  newEntryMetaData: EntryMetaData,
): Promise<void> => {
  const entries = await getAllEntriesMetaData();

  entries.push(newEntryMetaData);

  const file = new File(Paths.document, META_DATA_FILE_NAME);
  await file.write(JSON.stringify(entries, null, 2));
};

export const createNewEntryFile = async (
  entryMetaData: EntryMetaData,
): Promise<void> => {
  const entriesDirectory = new Directory(Paths.document, ENTRIES_DIRECTORY);

  if (!entriesDirectory.exists) {
    await entriesDirectory.create();
  }

  const entryFile = new File(entriesDirectory, `${entryMetaData.id}.json`);

  if (!entryFile.exists) {
    await entryFile.create();
  }

  const fileContent: Entry = { ...entryMetaData, content: "" };
  const stringifiedFileContent = JSON.stringify(fileContent, null, 2);

  await entryFile.write(stringifiedFileContent);
};

export const updateEntryFile = async (entry: Entry): Promise<void> => {
  const entriesDirectory = new Directory(Paths.document, ENTRIES_DIRECTORY);
  const entryFile = new File(entriesDirectory, `${entry.id}.json`);
  const stringifiedFileContent = JSON.stringify(entry, null, 2);

  await entryFile.write(stringifiedFileContent);
};

export const updateMetaDataFile = async (
  entryMetaData: EntryMetaData,
): Promise<void> => {
  const metaDataFile = new File(Paths.document, META_DATA_FILE_NAME);
  const allEntriesMetaData = await getAllEntriesMetaData();
  const index = allEntriesMetaData.findIndex(
    (entry) => entry.id === entryMetaData.id,
  );

  allEntriesMetaData[index] = entryMetaData;
  const stringifiedFileContent = JSON.stringify(allEntriesMetaData, null, 2);

  await metaDataFile.write(stringifiedFileContent);
};
