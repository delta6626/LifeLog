import { ScrollView, StyleSheet, View } from "react-native";

import { Button, Text } from "react-native-paper";
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

    featureButtonContainer: {
      flexDirection: "row",
      marginTop: theme.spacing.sm,
      gap: theme.spacing.md,
    },

    mainTitle: {
      marginTop: theme.spacing.xl,
      color: theme.colors.onPrimaryContainer,
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

        <View style={styles.featureButtonContainer}>
          <Button mode={"outlined"}>Favorites</Button>
          <Button icon={"plus"} mode={"contained"} style={{ flex: 1 }}>
            New memory
          </Button>
        </View>

        <View>
          <Text variant={"titleLarge"} style={styles.mainTitle}>
            Your memories
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
