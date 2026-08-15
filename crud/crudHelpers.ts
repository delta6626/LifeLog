import { Directory, File, Paths } from "expo-file-system";
import { Entry } from "../types/Entry";
import { EntryMetaData } from "../types/EntryMetaData";

// Metadata is stored in a separate index file for quick list loading and search queries,
// while the full rich-text content for each entry is saved in its own file under the entries directory.
const META_DATA_FILE_NAME = "metadata.json";
const ENTRIES_DIRECTORY = "entries";

const createMetaDataFile = async () => {
  const file = new File(Paths.document, META_DATA_FILE_NAME);

  if (!file.exists) {
    await file.create();
    await file.write("[]");
  }
};

// Reads the metadata index, creating it if it doesn't exist yet.
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

// Appends a new entry's metadata to the index file.
export const addNewEntryMetaData = async (
  newEntryMetaData: EntryMetaData,
): Promise<void> => {
  const entries = await getAllEntriesMetaData();

  entries.push(newEntryMetaData);

  const file = new File(Paths.document, META_DATA_FILE_NAME);
  await file.write(JSON.stringify(entries, null, 2));
};

// Creates the individual JSON file for a new entry, seeding it with an empty content string.
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

// Overwrites the full entry file with the updated entry object
export const updateEntryFile = async (entry: Entry): Promise<void> => {
  const entriesDirectory = new Directory(Paths.document, ENTRIES_DIRECTORY);
  const entryFile = new File(entriesDirectory, `${entry.id}.json`);
  const stringifiedFileContent = JSON.stringify(entry, null, 2);

  await entryFile.write(stringifiedFileContent);
};

// Finds the entry's existing record in the metadata index by ID and replaces it in the array
// then writes the whole updated array back to disk.
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

// Full entry files are only loaded when opening the entry screen — the feed uses the metadata index.
export const getEntryFile = async (entryId: Entry["id"]): Promise<Entry> => {
  const entriesDirectory = new Directory(Paths.document, ENTRIES_DIRECTORY);
  const entryFile = new File(entriesDirectory, `${entryId}.json`);

  const fileContents = await entryFile.text();

  return JSON.parse(fileContents) as Entry;
};

// Permanently removes an entry from both the filesystem and the metadata index.
export const deleteEntry = async (entryId: Entry["id"]): Promise<void> => {
  const entriesDirectory = new Directory(Paths.document, ENTRIES_DIRECTORY);
  const entryFile = new File(entriesDirectory, `${entryId}.json`);

  if (entryFile.exists) {
    await entryFile.delete();
  }

  const metaDataFile = new File(Paths.document, META_DATA_FILE_NAME);
  const allEntriesMetaData = await getAllEntriesMetaData();

  const updatedMetaData = allEntriesMetaData.filter(
    (entry) => entry.id !== entryId,
  );
  const stringifiedMetaData = JSON.stringify(updatedMetaData, null, 2);

  await metaDataFile.write(stringifiedMetaData);
};

// Flips the favorite flag on an entry.
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
