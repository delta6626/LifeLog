import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { ScreenHeaderTitle } from "../types/ScreenHeaderName";
import { useAppTheme } from "../utils/useAppTheme";

interface ScreenHeaderProps {
  screenHeaderTitle: ScreenHeaderTitle;
}

export const ScreenHeader = ({ screenHeaderTitle }: ScreenHeaderProps) => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    parentContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },

    titleText: {
      color: theme.colors.onPrimaryContainer,
    },
  });

  const handleBackButtonPress = () => {
    router.back();
  };

  return (
    <View style={styles.parentContainer}>
      {/* Back button to go to the previous screen */}
      <Pressable onPress={handleBackButtonPress}>
        <Icon
          source={"arrow-left"}
          size={24}
          color={theme.colors.onPrimaryContainer}
        ></Icon>
      </Pressable>

      <View>
        <Text variant={"titleMedium"} style={styles.titleText}>
          {screenHeaderTitle}
        </Text>
      </View>
    </View>
  );
};
