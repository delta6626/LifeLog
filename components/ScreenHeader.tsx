import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { ScreenHeaderTitle } from "../types/ScreenHeaderName";
import { useAppTheme } from "../utils/useAppTheme";

interface ScreenHeaderProps {
  screenHeaderTitle: ScreenHeaderTitle;
}

export const ScreenHeader = ({ screenHeaderTitle }: ScreenHeaderProps) => {
  const theme = useAppTheme();

  return (
    <View>
      <IconButton
        icon={"arrow-left"}
        iconColor={theme.colors.onPrimaryContainer}
      ></IconButton>
      <Text variant={"titleMedium"}>{screenHeaderTitle}</Text>
    </View>
  );
};
