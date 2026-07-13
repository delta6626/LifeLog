import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAppTheme } from "../utils/useAppTheme";

export const EntryHeaderButtons = () => {
  const theme = useAppTheme();

  return (
    <View style={{ flexDirection: "row", gap: theme.spacing.sm }}>
      <IconButton
        style={{ margin: 0 }}
        mode={"contained-tonal"}
        size={20}
        containerColor={theme.colors.primaryContainer}
        icon={"pen"}
        iconColor={theme.colors.onPrimaryContainer}
      ></IconButton>

      <IconButton
        style={{ margin: 0 }}
        mode={"contained-tonal"}
        size={20}
        containerColor={theme.colors.primaryContainer}
        icon={"heart"}
        iconColor={theme.colors.onPrimaryContainer}
      ></IconButton>
    </View>
  );
};
