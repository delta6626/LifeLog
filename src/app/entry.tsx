import { RichText, Toolbar, useEditorBridge } from "@10play/tentap-editor";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAppTheme } from "../../utils/useAppTheme";

export default function EntryScreen() {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },

    toolbarView: {
      height: 40,
    },
  });

  const editor = useEditorBridge({
    autofocus: true,
    avoidIosKeyboard: true,
    initialContent: "Start editing!",
    theme: {
      toolbar: {
        toolbarBody: {
          borderRadius: theme.radii.x3l,
          backgroundColor: theme.colors.outline,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        },

        toolbarButton: {
          backgroundColor: theme.colors.outline,
        },

        iconWrapper: {
          backgroundColor: theme.colors.outline,
          borderRadius: theme.radii.x3l,
        },
      },

      webview: {
        backgroundColor: "transparent",
      },
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScreenHeader screenHeaderTitle={"View memory"} />
      <View style={styles.toolbarView}>
        <Toolbar editor={editor} hidden={false} />
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <RichText editor={editor} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
