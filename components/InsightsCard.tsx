import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useAppTheme } from "../utils/useAppTheme";

export const InsightsCard = () => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    parentContainer: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radii.x3l,
      alignItems: "center",
    },

    separator: {
      width: 0.5,
      height: 40,
      backgroundColor: theme.colors.outline,
    },

    insightBox: {
      paddingVertical: theme.spacing.md,
      flex: 1,
      alignItems: "center",
    },

    insightBoxText: {
      color: theme.colors.onPrimaryContainer,
    },

    insightBoxSubtext: {
      color: theme.colors.onSurfaceVariant,
    },
  });

  return (
    <View style={styles.parentContainer}>
      <View style={styles.insightBox}>
        <Text variant={"titleMedium"} style={styles.insightBoxText}>
          6
        </Text>
        <Text variant={"labelSmall"} style={styles.insightBoxSubtext}>
          Total
        </Text>
      </View>

      <View style={styles.separator}></View>

      <View style={styles.insightBox}>
        <Text variant={"titleMedium"} style={styles.insightBoxText}>
          6
        </Text>
        <Text variant={"labelSmall"} style={styles.insightBoxSubtext}>
          This year
        </Text>
      </View>

      <View style={styles.separator}></View>

      <View style={styles.insightBox}>
        <Text variant={"titleMedium"} style={styles.insightBoxText}>
          43.4K
        </Text>
        <Text variant={"labelSmall"} style={styles.insightBoxSubtext}>
          Words
        </Text>
      </View>
    </View>
  );
};
