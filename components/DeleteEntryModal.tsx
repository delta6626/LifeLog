import { IconButton, Modal, Portal } from "react-native-paper";
import { useDeleteEntryModalStore } from "../store/deleteEntryModalStore";

export const DeleteEntryModal = () => {
  const { isVisible } = useDeleteEntryModalStore();

  return (
    <Portal>
      <Modal visible={isVisible}>
        <IconButton icon={"delete-outline"} />
      </Modal>
    </Portal>
  );
};
