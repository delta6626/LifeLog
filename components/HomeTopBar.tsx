import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";

export const HomeTopBar = () => {
  return (
    <View
      style={{
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      <Text variant={"headlineSmall"}>LifeLog</Text>
      <IconButton icon={"magnify"} mode={"contained-tonal"}></IconButton>
    </View>
  );
};
