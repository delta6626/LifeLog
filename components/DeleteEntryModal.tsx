import { StyleSheet } from "react-native";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";
import { useDeleteEntryModalStore } from "../store/deleteEntryModalStore";
import { useAppTheme } from "../utils/useAppTheme";

export const DeleteEntryModal = () => {
  const { isVisible } = useDeleteEntryModalStore();
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    modal: {
      alignSelf: "center",
      width: "80%",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      padding: 24,
      borderRadius: theme.radii.xl,
    },

    icon: {
      margin: 0,
      backgroundColor: theme.colors.errorContainer,
    },

    title: {
      marginTop: theme.spacing.md,
    },

    subtitle: {
      textAlign: "center",
      marginBottom: theme.spacing.xl,
    },

    cancelButton: {
      width: "100%",
      marginBottom: theme.spacing.sm,
    },

    deleteButton: {
      width: "100%",
      backgroundColor: theme.colors.errorContainer,
    },
  });

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modal}
        visible={isVisible}
        dismissable={true}
      >
        <IconButton
          icon={"delete-outline"}
          mode={"contained"}
          style={styles.icon}
          iconColor={theme.colors.error}
        />
        <Text variant={"titleMedium"} style={styles.title}>
          Delete this memory?
        </Text>
        <Text variant={"bodyMedium"} style={styles.subtitle}>
          This memory will be permanently deleted. This can't be undone.
        </Text>

        <Button mode={"contained"} style={styles.cancelButton}>
          Cancel
        </Button>
        <Button
          mode={"contained"}
          style={styles.deleteButton}
          textColor={theme.colors.error}
        >
          Delete
        </Button>
      </Modal>
    </Portal>
  );
};
