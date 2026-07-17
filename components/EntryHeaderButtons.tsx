import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useEntryScreenModeStore } from "../store/entryScreenModeStore";
import { useAppTheme } from "../utils/useAppTheme";

export const EntryHeaderButtons = () => {
  const theme = useAppTheme();
  const { entryScreenMode, setEntryScreenMode } = useEntryScreenModeStore();

  const handlePenIconPress = () => {
    if (entryScreenMode === "create" || entryScreenMode === "edit") {
      setEntryScreenMode("read");
      return;
    }

    setEntryScreenMode("edit");
  };

  return (
    <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
      <IconButton
        style={{ margin: 0 }}
        mode={"contained-tonal"}
        size={20}
        containerColor={theme.colors.primaryContainer}
        icon={"pen"}
        iconColor={theme.colors.onPrimaryContainer}
        onPress={handlePenIconPress}
      ></IconButton>

      {/* Favorite action is intentionally removed from the header for the time being. 
      Users can favorite entries from the entry card instead. */}

      {/* <IconButton
        style={{ margin: 0 }}
        mode={"contained-tonal"}
        size={20}
        containerColor={theme.colors.primaryContainer}
        icon={"heart-outline"}
        iconColor={theme.colors.onPrimaryContainer}
      ></IconButton> */}
    </View>
  );
};
