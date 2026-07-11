import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useAppTheme } from "../utils/useAppTheme";

export const HomeTopBar = () => {
  const theme = useAppTheme();

  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Text
        variant={"headlineSmall"}
        style={{ color: theme.colors.onPrimaryContainer }}
      >
        LifeLog
      </Text>
      <IconButton
        icon={"magnify"}
        mode={"contained-tonal"}
        containerColor={theme.colors.primaryContainer}
      ></IconButton>
    </View>
  );
};
