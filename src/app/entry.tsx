import { debounce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Icon, TextInput } from "react-native-paper";
import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";
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
  const theme = useAppTheme();
  const { entryScreenMode } = useEntryScreenModeStore();
  const { currentEntryId } = useCurrentEntryStore();

  const [title, setTitle] = useState<string>("");

  const editorRef = useRef<RichEditor | null>(null);
  const loadedEntry = useRef<Entry | null>(null);

  const handleTitleSubmit = () => {
    if (!editorRef.current) return;
    editorRef.current.focusContentEditor();
  };

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
      }, 300),
    [currentEntryId],
  );

  const debouncedEditorContentSave = useMemo(
    () =>
      debounce(async (content: string) => {
        if (!editorRef.current || !currentEntryId || !loadedEntry.current)
          return;

        const plainTextContent = content
          .replace(/<[^>]*>/g, "")
          .replace(/&nbsp;/g, " ");

        const wordCount = plainTextContent.match(/\S+/g)?.length ?? 0;

        const updatedEntry: Entry = {
          id: currentEntryId,
          title: loadedEntry.current.title,
          content: content,
          preview: plainTextContent.slice(0, 100).trim(),
          wordCount: wordCount,
          isFavorite: loadedEntry.current.isFavorite,
          updatedAt: Date.now(),
          createdAt: loadedEntry.current.createdAt,
        };

        loadedEntry.current = updatedEntry;

        await updateEntryFile(updatedEntry);
        await updateMetaDataFile(updatedEntry);
      }, 300),
    [currentEntryId],
  );

  const initializeEntry = async () => {
    if (!currentEntryId || !editorRef.current) return;
    const entryDetails = await getEntryFile(currentEntryId);

    setTitle(entryDetails.title);
    editorRef.current.setContentHTML(entryDetails.content);
    loadedEntry.current = entryDetails;
  };

  useEffect(() => {
    debouncedTitleSave(title);

    return () => {
      debouncedTitleSave.cancel();
    };
  }, [title, debouncedTitleSave]);

  useEffect(() => {
    return () => {
      debouncedEditorContentSave.cancel();
    };
  }, [debouncedEditorContentSave]);

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    childContainer: {
      flex: 1,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },

    editorContainer: {
      flex: 1,
    },

    toolbarContainer: {
      paddingTop: theme.spacing.md,
      paddingHorizontal: theme.spacing.x2l,
      marginBottom: theme.spacing.md,
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
      <View style={styles.childContainer}>
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
          submitBehavior={"submit"}
          onSubmitEditing={handleTitleSubmit}
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
            disabled={entryScreenMode === "read"}
            useContainer={false}
            placeholder={"Write something"}
            editorInitializedCallback={initializeEntry}
            onChange={debouncedEditorContentSave}
            editorStyle={{
              backgroundColor: "transparent",
              initialCSSText: `
              body{
                margin: 0 !important;
                padding: 0 !important;
              }

              #content{
                margin: 0 !important;
                padding: 0 !important;
              }
    
              div{
                margin: 0 !important;
                padding: 0 !important;
              }

              p {
                margin: 0 !important;
                padding: 0 !important;
              }
          `,
            }}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={[
          styles.toolbarContainer,
          { display: entryScreenMode === "read" ? "none" : "flex" },
        ]}
      >
        <RichToolbar
          editor={editorRef}
          actions={[
            "heading3",
            "paragraph",
            "bold",
            "italic",
            "underline",
            "justifyLeft",
            "justifyCenter",
            "justifyRight",
            "unorderedList",
            "insertLink",
          ]}
          style={{
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: theme.radii.full,
            height: 44,
            paddingVertical: 6,
            alignItems: "center",
          }}
          selectedButtonStyle={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radii.full,
            marginHorizontal: theme.spacing.xs,
          }}
          unselectedButtonStyle={{
            marginHorizontal: theme.spacing.xs,
          }}
          flatContainerStyle={{ backgroundColor: "transparent" }}
          iconSize={18}
          iconTint={theme.colors.onSurfaceVariant}
          selectedIconTint={theme.colors.primary}
          iconMap={{
            heading3: () => (
              <Icon
                source="alpha-h"
                size={28}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            paragraph: () => (
              <Icon
                source="format-paragraph"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            bold: () => (
              <Icon
                source="format-bold"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            italic: () => (
              <Icon
                source="format-italic"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            underline: () => (
              <Icon
                source="format-underline"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            justifyLeft: () => (
              <Icon
                source="format-align-left"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            justifyCenter: () => (
              <Icon
                source="format-align-center"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            justifyRight: () => (
              <Icon
                source="format-align-right"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            unorderedList: () => (
              <Icon
                source="format-list-bulleted"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
            insertLink: () => (
              <Icon
                source="link"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            ),
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
