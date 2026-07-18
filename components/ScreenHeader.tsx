import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useMetaDataStore } from "../store/metaDataStore";
import { ScreenHeaderTitle } from "../types/ScreenHeaderName";
import { useAppTheme } from "../utils/useAppTheme";
import { EntryHeaderButtons } from "./EntryHeaderButtons";

interface ScreenHeaderProps {
  screenHeaderTitle: ScreenHeaderTitle;
}

export const ScreenHeader = ({ screenHeaderTitle }: ScreenHeaderProps) => {
  const theme = useAppTheme();
  const { refreshMetaData } = useMetaDataStore();

  const styles = StyleSheet.create({
    parentContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.md,
    },

    titleText: {
      color: theme.colors.onPrimaryContainer,
    },

    childContainer: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });

  const handleBackButtonPress = () => {
    refreshMetaData();
    router.back();
  };

  return (
    <View style={styles.parentContainer}>
      {/* Back button to go to the previous screen */}
      <IconButton
        style={{ margin: 0 }}
        mode={"contained-tonal"}
        size={20}
        containerColor={theme.colors.primaryContainer}
        icon={"arrow-left"}
        iconColor={theme.colors.onPrimaryContainer}
        onPress={handleBackButtonPress}
      ></IconButton>

      <View style={styles.childContainer}>
        <Text variant={"titleMedium"} style={styles.titleText}>
          {screenHeaderTitle}
        </Text>

        {(screenHeaderTitle === "New memory" ||
          screenHeaderTitle === "Edit memory" ||
          screenHeaderTitle === "View memory") && <EntryHeaderButtons />}
      </View>
    </View>
  );
};
