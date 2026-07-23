import { RefObject, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Modal, Portal, Text, TextInput } from "react-native-paper";
import { RichEditor } from "react-native-pell-rich-editor";
import { useInsertLinkModalStore } from "../store/insertLinkModalStore";
import { useAppTheme } from "../utils/useAppTheme";

interface InsertLinkModalProps {
  editorRef: RefObject<RichEditor | null>;
}

export const InsertLinkModal = ({ editorRef }: InsertLinkModalProps) => {
  const theme = useAppTheme();

  const { isVisible, setIsVisible } = useInsertLinkModalStore();

  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const handleDismiss = () => {
    setIsVisible(false);
    setLinkText("");
    setLinkUrl("");
  };

  const handleInsert = () => {
    if (!editorRef.current || !linkUrl.trim()) return;

    editorRef.current.insertLink(
      linkText ? linkText.trim() : linkUrl.trim(),
      linkUrl.trim(),
    );

    handleDismiss();
  };

  const styles = StyleSheet.create({
    modal: {
      alignSelf: "center",
      width: "80%",
      backgroundColor: theme.colors.background,
      padding: 24,
      borderRadius: theme.radii.xl,
    },

    title: {
      marginBottom: theme.spacing.sm,
    },

    subtitle: {
      marginBottom: theme.spacing.lg,
    },

    textInput: {
      marginBottom: theme.spacing.md,
      backgroundColor: "transparent",
    },

    cancelButton: {
      width: "100%",
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },

    insertButton: {
      width: "100%",
    },
  });

  return (
    <Portal>
      <Modal
        visible={isVisible}
        onDismiss={handleDismiss}
        contentContainerStyle={styles.modal}
      >
        <Text variant="titleMedium" style={styles.title}>
          Insert link
        </Text>

        <Text variant="bodyMedium" style={styles.subtitle}>
          Enter the URL and optional display text.
        </Text>

        <TextInput
          mode="outlined"
          label="Display text"
          value={linkText}
          onChangeText={setLinkText}
          style={styles.textInput}
          outlineStyle={{ borderRadius: theme.radii.full }}
        />

        <TextInput
          mode="outlined"
          label="URL"
          value={linkUrl}
          onChangeText={setLinkUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={styles.textInput}
          outlineStyle={{ borderRadius: theme.radii.full }}
        />

        <Button
          mode="contained"
          style={styles.insertButton}
          onPress={handleInsert}
          disabled={!linkUrl.trim()}
        >
          Insert
        </Button>

        <Button
          mode="contained"
          style={styles.cancelButton}
          onPress={handleDismiss}
        >
          Cancel
        </Button>
      </Modal>
    </Portal>
  );
};
