import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useCurrentEntryStore } from "../../store/currentEntryStore";
import { useEntryScreenModeStore } from "../../store/entryScreenModeStore";
import { getEntryFile } from "../../utils/crudHelpers";
import { useAppTheme } from "../../utils/useAppTheme";

export default function EntryScreen() {
  const theme = useAppTheme();
  const { entryScreenMode } = useEntryScreenModeStore();
  const { currentEntryId } = useCurrentEntryStore();

  const [title, setTitle] = useState<string>("");

  const editorRef = useRef<RichEditor>(null);

  useEffect(() => {
    const initializeEntry = async () => {
      if (!currentEntryId || !editorRef.current) return;
      const entryDetails = await getEntryFile(currentEntryId);

      setTitle(entryDetails.title);
      editorRef.current.setContentHTML(entryDetails.content);
    };

    initializeEntry();
  }, [currentEntryId, editorRef]);

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

    editorContainer: {
      flex: 1,
      marginTop: theme.spacing.lg,
    },

    toolbarContainer: {
      paddingTop: theme.spacing.md,
    },

    titleInput: {
      backgroundColor: "transparent",
      marginTop: theme.spacing.lg,
      paddingHorizontal: 0,
      fontSize: theme.fonts.headlineSmall.fontSize,
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
        onChangeText={setTitle}
        maxLength={250}
        multiline
        mode="flat"
        placeholder="Title"
        style={styles.titleInput}
        editable={entryScreenMode !== "read"}
        autoFocus={entryScreenMode !== "read"}
        underlineStyle={{ display: "none" }}
        textColor={theme.colors.primary}
      />

      <View style={styles.editorContainer}>
        <RichEditor
          ref={editorRef}
          style={styles.editor}
          disabled={entryScreenMode === "read"}
          useContainer={false}
        />
      </View>

      <KeyboardAvoidingView behavior="padding" style={styles.toolbarContainer}>
        <RichToolbar editor={editorRef} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
