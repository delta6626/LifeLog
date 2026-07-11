import { ScrollView, StyleSheet } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { HomeTopBar } from "../../components/HomeTopBar";
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
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView>
        <HomeTopBar />
      </ScrollView>
    </SafeAreaView>
  );
}
