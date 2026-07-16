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
      backgroundColor: theme.colors.background,
      padding: 24,
      borderRadius: theme.radii.xl,
    },
  });

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modal}
        visible={isVisible}
        dismissable={true}
      >
        <IconButton icon={"delete-outline"} />
        <Text variant={"titleMedium"}>Delete this memory?</Text>
        <Text variant={"bodyMedium"}>
          This memory will be permanently deleted. This can't be undone.
        </Text>

        <Button mode={"outlined"}>Cancel</Button>
        <Button mode={"contained"}>Delete</Button>
      </Modal>
    </Portal>
  );
};
