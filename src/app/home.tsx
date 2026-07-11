import { ScrollView, StyleSheet } from "react-native";

import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeTopBar } from "../../components/HomeTopBar";
import { InsightsCard } from "../../components/InsightsCard";
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

    greetingText: {
      marginTop: theme.spacing.md,
      color: theme.colors.onSurfaceVariant,
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView>
        <HomeTopBar />
        <Text variant={"titleMedium"} style={styles.greetingText}>
          Good afternoon
        </Text>
        <InsightsCard />
      </ScrollView>
    </SafeAreaView>
  );
}
