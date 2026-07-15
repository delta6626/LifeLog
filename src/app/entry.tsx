import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useCurrentEntryStore } from "../../store/currentEntryStore";
import { useEntryScreenModeStore } from "../../store/entryScreenModeStore";
import { useAppTheme } from "../../utils/useAppTheme";

export default function EntryScreen() {
  const theme = useAppTheme();

  const { currentEntry } = useCurrentEntryStore();
  const { entryScreenMode } = useEntryScreenModeStore();

  const editor = useEditorBridge({
    autofocus: entryScreenMode === "read" ? false : true,
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
  });

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
