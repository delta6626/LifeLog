import {
  EditorBridge,
  RichText,
  Toolbar,
  useEditorBridge,
} from "@10play/tentap-editor";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useCurrentEntryStore } from "../../store/currentEntryStore";
import { useEntryScreenModeStore } from "../../store/entryScreenModeStore";
import { Entry } from "../../types/Entry";
import {
  getEntryFile,
  updateEntryFile,
  updateMetaDataFile,
} from "../../utils/crudHelpers";
import { useAppTheme } from "../../utils/useAppTheme";

export default function EntryScreen() {
  const editorRef = useRef<EditorBridge | null>(null);

  const theme = useAppTheme();
  const { currentEntryId } = useCurrentEntryStore();
  const { entryScreenMode } = useEntryScreenModeStore();

  const [title, setTitle] = useState<string>();
  const [entry, setEntry] = useState<Entry | null>(null);
  const entryRef = useRef<Entry | null>(null);

  const debouncedSaveEditorContent = useMemo(
    () =>
      debounce(async () => {
        if (!editorRef.current) return;

        const currentEntry = entryRef.current;
        if (!currentEntry) return;

        const editorContent = await editorRef.current.getHTML();
        const plainTextContent = await editorRef.current.getText();

        const updatedEntry: Entry = {
          ...currentEntry,
          content: editorContent,
          preview: plainTextContent.slice(0, 100),
          updatedAt: Date.now(),
        };

        entryRef.current = updatedEntry;
        setEntry(updatedEntry);

        await updateEntryFile(updatedEntry);
        await updateMetaDataFile(updatedEntry);
      }, 300),
    [],
  );

  const debouncedSaveTitle = useMemo(
    () =>
      debounce(async (title: string) => {
        if (!entryRef.current) return;

        const updatedEntry = {
          ...entryRef.current,
          title,
          updatedAt: Date.now(),
        };

        entryRef.current = updatedEntry;
        setEntry(updatedEntry);

        await updateEntryFile(updatedEntry);
        await updateMetaDataFile(updatedEntry);
      }, 300),
    [],
  );

  const editor = useEditorBridge({
    autofocus: entryScreenMode !== "read",
    editable: entryScreenMode !== "read",
    avoidIosKeyboard: true,

    theme: {
      toolbar: {
        toolbarBody: {
          borderRadius: theme.radii.x3l,
          backgroundColor: theme.colors.primaryContainer,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        },

        toolbarButton: {
          backgroundColor: theme.colors.primaryContainer,
        },

        iconWrapper: {
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: theme.radii.x3l,
        },

        iconActive: {
          backgroundColor: theme.colors.background,
          borderRadius: theme.radii.x3l,
        },
      },
    },

    onChange: () => {
      debouncedSaveEditorContent();
    },
  });

  const handleTitleChange = (text: string) => {
    setTitle(text);
    debouncedSaveTitle(text);
  };

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    const loadEntry = async () => {
      if (!currentEntryId) return;

      const loadedEntry = await getEntryFile(currentEntryId);

      setTitle(loadedEntry.title);
      setEntry(loadedEntry);
      entryRef.current = loadedEntry;

      while (!editor.getEditorState().isReady) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      editor.setContent(loadedEntry.content);
    };

    loadEntry();
  }, [currentEntryId]);

  useEffect(() => {
    return () => {
      debouncedSaveEditorContent.cancel();
    };
  }, [debouncedSaveEditorContent]);

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },

    editor: {
      flex: 1,
      backgroundColor: "transparent",
    },

    toolbarContainer: {
      position: "absolute",
      left: theme.spacing.xl,
      right: theme.spacing.xl,
      bottom: theme.spacing.xl,
    },

    titleInput: {
      backgroundColor: "transparent",
      margin: 0,
      paddingHorizontal: 0,
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScreenHeader
        screenHeaderTitle={
          entryScreenMode === "create"
            ? "New memory"
            : entryScreenMode === "edit"
              ? "Edit memory"
              : "View memory"
        }
      />

      <TextInput
        value={title}
        onChangeText={handleTitleChange}
        maxLength={250}
        multiline={true}
        mode={"flat"}
        placeholder="Title"
        style={styles.titleInput}
        editable={entryScreenMode != "read"}
      />

      <RichText
        editor={editor}
        style={styles.editor}
        showsVerticalScrollIndicator={false}
      />

      <KeyboardAvoidingView behavior="padding" style={styles.toolbarContainer}>
        <Toolbar editor={editor} hidden={entryScreenMode === "read"} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
