import { ScrollView, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../utils/useAppTheme";

export default function HomeScreen() {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },

    topBar: {
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView>
        <View style={styles.topBar}>
          <Text variant={"headlineSmall"}>LifeLog</Text>
          <IconButton icon={"magnify"} mode={"contained-tonal"}></IconButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
