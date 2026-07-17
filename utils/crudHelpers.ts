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

export const getEntryFile = async (entryId: Entry["id"]): Promise<Entry> => {
  const entriesDirectory = new Directory(Paths.document, ENTRIES_DIRECTORY);
  const entryFile = new File(entriesDirectory, `${entryId}.json`);

  const fileContents = await entryFile.text();

  return JSON.parse(fileContents) as Entry;
};

export const deleteEntry = async (entryId: Entry["id"]): Promise<void> => {
  // Delete the entry file
  const entriesDirectory = new Directory(Paths.document, ENTRIES_DIRECTORY);
  const entryFile = new File(entriesDirectory, `${entryId}.json`);

  if (entryFile.exists) {
    await entryFile.delete();
  }

  // Remove the metadata
  const metaDataFile = new File(Paths.document, META_DATA_FILE_NAME);
  const allEntriesMetaData = await getAllEntriesMetaData();

  const updatedMetaData = allEntriesMetaData.filter(
    (entry) => entry.id !== entryId,
  );
  const stringifiedMetaData = JSON.stringify(updatedMetaData, null, 2);

  await metaDataFile.write(stringifiedMetaData);
};

export const toggleEntryFavoriteStatus = async (
  entryId: Entry["id"],
): Promise<void> => {
  const entry = await getEntryFile(entryId);

  const updatedEntry: Entry = {
    ...entry,
    isFavorite: !entry.isFavorite,
  };

  await Promise.all([
    updateEntryFile(updatedEntry),
    updateMetaDataFile(updatedEntry),
  ]);
};
