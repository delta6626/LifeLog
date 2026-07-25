# LifeLog – Software Design Overview

## 1. Introduction

LifeLog is a cross-platform mobile journalling application built with **React Native** and **Expo**. It allows users to create, edit, search, and favourite personal diary entries ("memories"), each of which supports rich-text formatting. All data is stored entirely on-device; the app has no network dependency and makes no calls to external services.

---

## 2. High-Level Architecture

The application follows a **layered architecture** with four clearly separated concerns:

```
┌─────────────────────────────────────────────────────┐
│                     Screens (src/app/)               │
│         home  ·  entry  ·  search  ·  favorites      │
└────────────────────────┬────────────────────────────┘
                         │ reads / dispatches
┌────────────────────────▼────────────────────────────┐
│               Reusable Components (components/)      │
│  EntryCard · InsightsCard · ScreenHeader · Modals …  │
└───────────┬─────────────────────────┬───────────────┘
            │ subscribes              │ calls
┌───────────▼──────────┐   ┌─────────▼───────────────┐
│   Global State        │   │   Utility Layer          │
│   (store/ – Zustand)  │   │   (utils/ – pure fns)    │
└───────────┬──────────┘   └─────────┬───────────────┘
            │                        │
┌───────────▼────────────────────────▼───────────────┐
│              Persistence Layer                       │
│     expo-file-system  ·  JSON files on device        │
└─────────────────────────────────────────────────────┘
```

| Layer        | Technology                        | Role                                                              |
| ------------ | --------------------------------- | ----------------------------------------------------------------- |
| Screens      | Expo Router (file-based)          | Page-level UI and navigation orchestration                        |
| Components   | React Native + React Native Paper | Reusable, themed UI building blocks                               |
| Global State | Zustand                           | Lightweight in-memory state shared across components              |
| Utilities    | Pure TypeScript functions         | Business logic (filtering, grouping, word counting …)             |
| Persistence  | `expo-file-system` (Next API)     | Reading and writing JSON files to the device's document directory |

---

## 3. Navigation

Navigation is handled entirely by **Expo Router**, which uses the file system inside `src/app/` to define routes — each file becomes a screen with no manual route registration required.

### 3.1 Root Layout (`src/app/_layout.tsx`)

```tsx
export default function RootLayout() {
  registerTranslation("en", en);

  return (
    // Wrap with PaperProvider to apply material theming globally
    <PaperProvider theme={theme}>
      {/* Define screens */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="entry" />
        <Stack.Screen name="search" />
        <Stack.Screen name="favorites" />
      </Stack>
    </PaperProvider>
  );
}
```

`_layout.tsx` serves two purposes simultaneously. First, it wraps the entire app in `PaperProvider`, making the custom Material Design 3 theme available to every component via React Context. Second, it declares all four screens inside a `Stack` navigator with `headerShown: false`, so custom in-app headers are used throughout instead of the default native navigation bar. The `registerTranslation` call at the top initialises the English locale for the `react-native-paper-dates` date-picker that appears on the Search screen.

### 3.2 Screen-to-Screen Navigation

Navigation between screens is performed imperatively using the `router` object from `expo-router`. Because the `Entry` screen is reused for creating, editing, and reading a memory, two Zustand stores are written **before** navigating to it, so the screen knows what mode to open in and which entry to load:

```tsx
// In home.tsx — opening the Entry screen to create a brand-new memory
const handleNewMemoryButtonPress = async () => {
  const entryMetaData: EntryMetaData = {
    id: randomUUID(),
    isFavorite: false,
    title: "New memory",
    preview: "",
    wordCount: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  await addNewEntryMetaData(entryMetaData);
  await createNewEntryFile(entryMetaData);

  setCurrentEntryId(entryMetaData.id); // tell Entry screen which entry to load
  setEntryScreenMode("create"); // tell Entry screen which mode to use
  router.navigate("/entry");
};
```

```tsx
// In EntryCard.tsx — opening an existing entry in read-only mode
const handleEntryCardPress = () => {
  setCurrentEntryId(entryMetaData.id);
  setEntryScreenMode("read");
  router.navigate("/entry");
};
```

When the user returns from a secondary screen, `ScreenHeader` refreshes the metadata list so the Home feed immediately reflects any changes:

```tsx
// In components/ScreenHeader.tsx
const handleBackButtonPress = () => {
  refreshMetaData(); // pull latest metadata from disk before going back
  router.back();
};
```

### 3.3 Navigation Map

```
Home ──[search icon]──► Search
Home ──[Favorites btn]─► Favorites
Home ──[New memory btn]─► Entry (create mode)
Home ──[EntryCard tap]──► Entry (read mode)
Search ──[EntryCard tap]► Entry (read mode)
Favorites──[EntryCard tap]► Entry (read mode)
Entry ──[back arrow]────► previous screen
```

---

## 4. Data Structures

### 4.1 `Entry` (full entry stored on disk)

Defined in `types/Entry.ts`:

```ts
export interface Entry {
  id: string;

  title: string;
  content: string; // HTML string produced by the rich-text editor
  preview: string; // Plain-text excerpt (first ~100 chars) for the card
  wordCount: number;
  isFavorite: boolean;

  createdAt: EpochTimeStamp; // Milliseconds since UNIX epoch
  updatedAt: EpochTimeStamp;
}
```

`content` stores the raw HTML output of the `react-native-pell-rich-editor`. Storing HTML allows all formatting (bold, italic, headings, links, lists) to be preserved and re-loaded without any conversion step.

### 4.2 `EntryMetaData` (lightweight index record)

Defined in `types/EntryMetaData.ts`:

```ts
export type EntryMetaData = Pick<
  Entry,
  | "id"
  | "title"
  | "preview"
  | "wordCount"
  | "isFavorite"
  | "createdAt"
  | "updatedAt"
>;
```

`EntryMetaData` is a **structural subset** of `Entry` — it omits only the `content` field. This is a deliberate performance optimisation: the Home, Search, and Favorites screens never need the full HTML body, so they operate exclusively on `EntryMetaData`. Loading all entries as full `Entry` objects on app start would be unnecessarily expensive as the journal grows.

### 4.3 `EntryScreenMode`

```ts
export type EntryScreenMode = "create" | "edit" | "read";
```

A simple union type that drives which UI controls are active on the Entry screen — for example, whether the rich-text editor is editable and whether the formatting toolbar is visible.

### 4.4 `EntryGroup` (derived, in-memory)

```ts
export interface EntryGroup {
  title: string; // e.g. "July 2026"
  entries: EntryMetaData[];
}
```

Produced at render time by `groupEntriesByMonth()`. It is never persisted — it is always re-derived from the current `metaDataList` whenever the Home, Search, or Favorites screens render.

---

## 5. Persistence Layer

All data is persisted locally using the **Next File System API** from `expo-file-system`. There are no databases, no cloud services, and no user authentication.

### 5.1 File Layout on Device

```
<Paths.document>/
├── metadata.json          ← flat JSON array of EntryMetaData[]
└── entries/
    ├── <uuid>.json        ← one file per entry (full Entry object)
    ├── <uuid>.json
    └── …
```

The separation between a single shared index (`metadata.json`) and individual entry files (`entries/<id>.json`) mirrors the classic index-and-document pattern: list views read only the index; the full document is only fetched on demand when the user actually opens an entry.

### 5.2 CRUD Operations (`utils/crudHelpers.ts`)

All file I/O is centralised in `crudHelpers.ts`. Below are two representative examples.

**Creating a new entry** involves two atomic writes — one to append to the index, one to create the entry file:

```ts
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
  if (!entryFile.exists) await entryFile.create();

  const fileContent: Entry = { ...entryMetaData, content: "" };
  await entryFile.write(JSON.stringify(fileContent, null, 2));
};
```

**Deleting an entry** removes the individual file first, then rewrites the index without that record:

```ts
// Permanently removes an entry from both the filesystem and the metadata index.
export const deleteEntry = async (entryId: Entry["id"]): Promise<void> => {
  const entryFile = new File(
    new Directory(Paths.document, ENTRIES_DIRECTORY),
    `${entryId}.json`,
  );

  if (entryFile.exists) {
    await entryFile.delete();
  }

  const allEntriesMetaData = await getAllEntriesMetaData();
  const updatedMetaData = allEntriesMetaData.filter(
    (entry) => entry.id !== entryId,
  );

  const metaDataFile = new File(Paths.document, META_DATA_FILE_NAME);
  await metaDataFile.write(JSON.stringify(updatedMetaData, null, 2));
};
```

---

## 6. Global State Management

Global state is managed with **Zustand** (`store/`). Each store is a small, focused slice of state — this avoids a monolithic store and makes it straightforward to trace which part of the app is responsible for a given piece of state.

| Store                      | State held                                      | Primary consumers                                |
| -------------------------- | ----------------------------------------------- | ------------------------------------------------ |
| `useMetaDataStore`         | `metaDataList: EntryMetaData[]`                 | Home, Search, Favorites, InsightsCard, EntryCard |
| `useCurrentEntryStore`     | `currentEntryId: string \| null`                | Entry screen                                     |
| `useEntryScreenModeStore`  | `entryScreenMode: "create" \| "edit" \| "read"` | Entry screen, EntryHeaderButtons                 |
| `useDeleteEntryModalStore` | `isVisible`, `idForDeletion`                    | DeleteEntryModal, EntryCard                      |
| `useInsertLinkModalStore`  | `isVisible`                                     | InsertLinkModal, Entry screen toolbar            |

### 6.1 `useMetaDataStore`

```ts
export const useMetaDataStore = create<MetaDataStore>((set) => ({
  metaDataList: [],
  setMetaDataList: (metaDataList) => {
    set({ metaDataList });
  },
  refreshMetaData: async () => {
    const metaDataList = await getAllEntriesMetaData();
    set({ metaDataList });
  },
}));
```

`refreshMetaData` is the key action: it reads the current `metadata.json` from disk and pushes the parsed array into the store. All screens that display entry lists call `refreshMetaData` on focus (via `useFocusEffect`) or on navigation back, so the UI is always consistent with what is on disk.

---

## 7. Screen-by-Screen Breakdown

### 7.1 Home Screen (`src/app/home.tsx`)

The Home screen is the app's entry point. On focus it calls `refreshMetaData()` to sync with disk and clears `currentEntryId` (so stale state from a previous entry visit cannot leak in):

```tsx
useFocusEffect(
  useCallback(() => {
    refreshMetaData();
    setCurrentEntryId(null);
  }, [setMetaDataList]),
);
```

Entries are grouped by month before rendering using the `groupEntriesByMonth` utility, and each group is rendered as a labelled section of `EntryCard` components:

```tsx
const groupedEntries = groupEntriesByMonth(metaDataList);

// …

{
  groupedEntries.map((group) => (
    <View key={group.title}>
      <Text variant="titleMedium">{group.title}</Text>

      <View>
        {group.entries.map((entry) => (
          <EntryCard key={entry.id} entryMetaData={entry} />
        ))}
      </View>
    </View>
  ));
}
```

It also renders the `InsightsCard` (total entries, entries this year, total word count) and the `DeleteEntryModal`, which is kept at this level so it overlays the entire screen via React Native Paper's `Portal`.

### 7.2 Entry Screen (`src/app/entry.tsx`)

The Entry screen is the most complex screen in the app. It hosts a plain-text `TextInput` for the title and a `RichEditor` (from `react-native-pell-rich-editor`, which renders inside a `WebView`) for the body. Both are wired to **debounced auto-save** functions so that every keystroke eventually triggers a write without overwhelming the file system:

```ts
const DEBOUNCE_DURATION = 300; // ms

// Both saves are debounced to avoid excessive file system operations on every keystroke
const debouncedTitleSave = useMemo(
  () =>
    debounce(async (title: string) => {
      if (!currentEntryId || !loadedEntry.current) return;

      const updatedEntry: Entry = {
        ...loadedEntry.current,
        title,
        updatedAt: Date.now(),
      };

      loadedEntry.current = updatedEntry;

      await updateEntryFile(updatedEntry);
      await updateMetaDataFile(updatedEntry);
    }, DEBOUNCE_DURATION),
  [currentEntryId],
);
```

`loadedEntry` is a `useRef` (not `useState`) so that the debounced callbacks always close over the latest version of the entry without re-creating themselves on every render. When the editor's content changes, a similar debounced function strips the HTML to plain text, recomputes the preview and word count, then writes both the entry file and the metadata index atomically:

```ts
const debouncedEditorContentSave = useMemo(
  () =>
    debounce(async (content: string) => {
      if (!editorRef.current || !currentEntryId || !loadedEntry.current) return;

      const plainTextContent = getEntryPlainTextContent(content);

      const updatedEntry: Entry = {
        id: currentEntryId,
        title: loadedEntry.current.title,
        content: content, // full HTML retained
        preview: getEntryPreview(plainTextContent), // short plain-text excerpt
        wordCount: getEntryWordCount(plainTextContent),
        isFavorite: loadedEntry.current.isFavorite,
        updatedAt: Date.now(),
        createdAt: loadedEntry.current.createdAt,
      };

      loadedEntry.current = updatedEntry;

      await updateEntryFile(updatedEntry);
      await updateMetaDataFile(updatedEntry);
    }, DEBOUNCE_DURATION),
  [currentEntryId],
);
```

The screen's mode (`create`, `edit`, `read`) gates interactivity. In `read` mode, both the title input and the editor are set to non-editable, and the formatting toolbar is hidden:

```tsx
<TextInput
  editable={entryScreenMode !== "read"}
  autoFocus={entryScreenMode !== "read"}
  …
/>

<RichEditor
  disabled={entryScreenMode === "read"}
  …
/>

<KeyboardAvoidingView
  style={[{ display: entryScreenMode === "read" ? "none" : "flex" }]}
>
  <RichToolbar … />
</KeyboardAvoidingView>
```

The formatting toolbar supports heading 3, paragraph, bold, italic, underline, left/centre/right alignment, ordered and unordered lists, and a custom **Insert Link** action. Pressing the link icon sets `isVisible` in `useInsertLinkModalStore` to `true`, which triggers the `InsertLinkModal` overlay:

```tsx
<RichToolbar
  actions={[
    "heading3", "paragraph", "bold", "italic", "underline",
    "justifyLeft", "justifyCenter", "justifyRight",
    "orderedList", "unorderedList",
    "appendLink", // Custom action
  ]}
  appendLink={() => {
    setInsertLinkModalVisible(true);
  }}
  …
/>
```

### 7.3 Search Screen (`src/app/search.tsx`)

The Search screen operates on the existing in-memory `metaDataList` from `useMetaDataStore` — no additional disk reads are performed. A `useEffect` re-runs the filter whenever either the title input or the selected date changes:

```tsx
useEffect(() => {
  const trimmedSearch = searchTitle.trim().toLowerCase();

  // Keep search results empty if no active filters are provided, rather than listing all entries
  if (trimmedSearch === "" && !date) {
    setFilteredEntries([]);
    return;
  }

  setFilteredEntries(filterEntries(metaDataList, searchTitle, date));
}, [searchTitle, date, metaDataList]);
```

`filterEntries` applies both criteria independently, so the user can filter by title alone, date alone, or both simultaneously:

```ts
export function filterEntries(
  entries: EntryMetaData[],
  searchTitle: string,
  date?: CalendarDate,
) {
  return entries.filter((entry) => {
    const titleMatches =
      trimmedSearch === "" || entry.title.toLowerCase().includes(trimmedSearch);

    const dateMatches =
      !date || isSameCalendarDay(new Date(entry.createdAt), date);

    return titleMatches && dateMatches;
  });
}
```

The date picker is provided by `react-native-paper-dates` and launches as a modal (`DatePickerModal`). The selected date is stored in local component state and fed into `filterEntries` on every render.

### 7.4 Favorites Screen (`src/app/favorites.tsx`)

The Favorites screen is intentionally minimal. It derives its list from the already-loaded `metaDataList` in a single pure function call, then applies the same `groupEntriesByMonth` grouping used on the Home screen:

```tsx
const favoriteEntries = getFavoriteEntries(metaDataList);
const favoritesGrouped = groupEntriesByMonth(favoriteEntries);
```

`getFavoriteEntries` simply filters on the `isFavorite` flag. Because this flag is stored on both `Entry` (entry file) and `EntryMetaData` (index), toggling a favourite in `EntryCard` can update both files in parallel without loading the full entry:

```ts
// In utils/crudHelpers.ts
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
```

---

## 8. Reusable Components

### 8.1 `EntryCard`

`EntryCard` receives a single `EntryMetaData` prop and renders the entry's title, preview text, creation date, a delete button, and a favourite-toggle button. It is the primary interactive element on all three list screens. The card's `onPress` handler sets up the two Zustand stores and navigates to the Entry screen in read mode (see §3.2).

### 8.2 `ScreenHeader`

`ScreenHeader` appears at the top of the Entry, Search, and Favorites screens. It renders a back button and the screen title. When the title is one of the three entry-related titles (`"New memory"`, `"Edit memory"`, `"View memory"`), it additionally renders `EntryHeaderButtons` — the pen icon that toggles between `read` and `edit` modes in `useEntryScreenModeStore`.

### 8.3 `InsightsCard`

`InsightsCard` derives three statistics live from `metaDataList`:

- **Total** – `metaDataList.length`
- **This year** – entries whose `createdAt` falls in the current calendar year
- **Words** – sum of all `wordCount` values, formatted with `K`/`M` suffixes for readability

### 8.4 `DeleteEntryModal`

`DeleteEntryModal` is a `Portal`-rendered modal driven by `useDeleteEntryModalStore`. Pressing the delete button on any `EntryCard` sets `idForDeletion` and `isVisible: true` in the store. The modal then calls `deleteEntry(idForDeletion)` and refreshes the metadata list on confirmation.

### 8.5 `InsertLinkModal`

`InsertLinkModal` collects a display text and a URL, then calls `editorRef.current.insertLink(text, url)` to insert an anchor tag directly into the `RichEditor`'s WebView. It receives the `editorRef` as a prop from the Entry screen, giving it a direct imperative handle on the editor without needing to lift state.

---

## 9. Utility Functions

All utility functions are pure (no side effects) and live in `utils/`.

| File                          | Purpose                                                                             |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `crudHelpers.ts`              | All file-system reads and writes                                                    |
| `filterEntries.ts`            | Title and date-based entry filtering                                                |
| `groupEntriesByMonth.ts`      | Sorts entries by `createdAt` and groups into `EntryGroup[]` by month/year           |
| `getEntryPlainTextContent.ts` | Strips HTML tags to extract plain text from a rich-text entry                       |
| `getEntryPreview.ts`          | Returns the first ~120 characters of plain text as a card preview                   |
| `getEntryWordCount.ts`        | Counts whitespace-delimited words in the plain-text content                         |
| `wordCount.ts`                | Aggregates word counts across `metaDataList`; formats large numbers (K/M/B)         |
| `getEntriesThisYear.ts`       | Filters `metaDataList` to entries created in the current calendar year              |
| `getFavoriteEntries.ts`       | Filters `metaDataList` to entries where `isFavorite === true`                       |
| `formatDayDate.ts`            | Formats an epoch timestamp as a human-readable date string                          |
| `getGreetingText.ts`          | Returns a time-aware greeting ("Good morning", "Good afternoon", etc.)              |
| `isSameCalendarDay.ts`        | Compares two `Date` objects ignoring time                                           |
| `theme.ts`                    | Defines the app's Material Design 3 colour palette, spacing scale, and border radii |
| `useAppTheme.ts`              | Typed `useTheme` hook that exposes the custom theme object                          |

---

## 10. Theming

The app uses a single custom theme defined in `utils/theme.ts`, which extends Material Design 3's `MD3LightTheme` from `react-native-paper`:

```ts
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: "#F6F5EE",       // warm off-white
    surface: "#FFFFFF",
    primary: "#5B7052",          // muted forest green
    primaryContainer: "#DCE3D0",
    onPrimaryContainer: "#43543D",
    tertiary: "#C1673D",         // terracotta accent
    muted: "#919b88",
    error: "#D32F2F",
    errorContainer: "#fadcd9",
    // …
  },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, x2l: 32, x3l: 48 },
  radii:   { none: 0, …, full: 9999 },
};
```

The theme is injected at the root via `PaperProvider` (in `_layout.tsx`) and consumed in every component via the `useAppTheme()` hook, meaning all colour, spacing, and radius values come from one source of truth. Styles are created inline using `StyleSheet.create` inside each component so they can reference the live theme object.

---

## 11. External Libraries

The app does not contact any external server or API. The third-party libraries used are all runtime components bundled within the app:

| Library                          | Version | Usage                                           |
| -------------------------------- | ------- | ----------------------------------------------- |
| `expo-router`                    | ~57.0.4 | File-based navigation (Stack)                   |
| `expo-file-system`               | ~57.0.0 | Local file read/write via Next API              |
| `expo-crypto`                    | ~57.0.1 | `randomUUID()` for generating entry IDs         |
| `react-native-paper`             | ^5.15.3 | Material Design 3 UI components and theming     |
| `react-native-paper-dates`       | ^0.23.9 | Calendar date-picker modal on the Search screen |
| `react-native-pell-rich-editor`  | ^1.10.0 | WebView-based rich-text editor and toolbar      |
| `zustand`                        | ^5.0.14 | Minimal global state management                 |
| `lodash.debounce`                | ^4.0.8  | Debouncing auto-save on keystroke events        |
| `react-native-safe-area-context` | ~5.7.0  | Safe-area insets on notched devices             |
