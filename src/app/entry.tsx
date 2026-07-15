import {
  EditorBridge,
  RichText,
  Toolbar,
  useEditorBridge,
} from "@10play/tentap-editor";
import { debounce } from "lodash";
import { useEffect, useMemo, useRef } from "react";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useCurrentEntryStore } from "../../store/currentEntryStore";
import { useEntryScreenModeStore } from "../../store/entryScreenModeStore";
import { updateEntryFile, updateMetaDataFile } from "../../utils/crudHelpers";
import { useAppTheme } from "../../utils/useAppTheme";

export default function EntryScreen() {
  const editorRef = useRef<EditorBridge | null>(null);

  const theme = useAppTheme();
  const { currentEntry, setCurrentEntry } = useCurrentEntryStore();
  const { entryScreenMode } = useEntryScreenModeStore();

  const debouncedSaveEditorContent = useMemo(
    () =>
      debounce(async () => {
        if (!editorRef.current) return;
        if (!currentEntry) return;

        const editorContent = await editorRef.current.getText();

        setCurrentEntry({
          ...currentEntry,
          content: editorContent,
          preview: editorContent.slice(0, 100),
          updatedAt: Date.now(),
        });

        await updateEntryFile({
          ...currentEntry,
          content: editorContent,
          preview: editorContent.slice(0, 100),
          updatedAt: Date.now(),
        });

        await updateMetaDataFile({
          ...currentEntry,
          preview: editorContent.slice(0, 100),
          updatedAt: Date.now(),
        });
      }, 300),

    [currentEntry],
  );

  const editor = useEditorBridge({
    autofocus: entryScreenMode === "read" ? false : true,
    editable: entryScreenMode === "read" ? false : true,
    avoidIosKeyboard: true,
    initialContent: currentEntry?.content,
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

  editorRef.current = editor;

  useEffect(() => {
    return () => debouncedSaveEditorContent.cancel();
  }, []);

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

      <RichText
        editor={editor}
        style={styles.editor}
        showsVerticalScrollIndicator={false}
      />
      <KeyboardAvoidingView
        behavior={"padding"}
        style={styles.toolbarContainer}
      >
        <Toolbar
          editor={editor}
          hidden={entryScreenMode === "read" ? true : false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
