import { StyleSheet, View } from "react-native";
import { IconButton, Text, TouchableRipple } from "react-native-paper";
import { useAppTheme } from "../utils/useAppTheme";

export const EntryCard = () => {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      padding: theme.spacing.md,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.xl,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },

    titleText: {
      color: theme.colors.primary,
    },

    bodyText: {
      color: theme.colors.onSurfaceVariant,
      marginTop: theme.spacing.xs,
    },

    bottomContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: theme.spacing.xs,
    },

    dateText: {
      color: theme.colors.muted,
    },

    iconButtonsContainer: {
      flexDirection: "row",
      gap: theme.spacing.sm,
    },
  });

  return (
    <TouchableRipple style={styles.parentContainer}>
      <View>
        <Text variant={"titleMedium"} style={styles.titleText}>
          Wrapping up a lonk week
        </Text>
        <Text variant={"bodyMedium"} style={styles.bodyText} numberOfLines={3}>
          Closed my laptop a little early tonight. It's the first time in weeks
          I didn't feel behind on something.
        </Text>

        <View style={styles.bottomContainer}>
          <Text variant={"bodySmall"} style={styles.dateText}>
            10 July, 11:33 PM
          </Text>
          <View style={styles.iconButtonsContainer}>
            <IconButton
              style={{ margin: 0 }}
              mode={"outlined"}
              size={16}
              icon={"delete-outline"}
              iconColor={theme.colors.muted}
            />
            <IconButton
              style={{ margin: 0 }}
              mode={"outlined"}
              size={16}
              icon={"heart-outline"}
              iconColor={theme.colors.muted}
            />
          </View>
        </View>
      </View>
    </TouchableRipple>
  );
};
