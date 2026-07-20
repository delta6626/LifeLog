import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { EntryCard } from "../../components/EntryCard";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useMetaDataStore } from "../../store/metaDataStore";
import { getFavoriteEntries } from "../../utils/getFavoriteEntries";
import { groupEntriesByMonth } from "../../utils/groupEntriesByMonth";
import { useAppTheme } from "../../utils/useAppTheme";

export default function FavoritesScreen() {
  const theme = useAppTheme();
  const { metaDataList } = useMetaDataStore();

  const favoriteEntries = getFavoriteEntries(metaDataList);
  const favoritesGrouped = groupEntriesByMonth(favoriteEntries);

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    childContainer: {
      flex: 1,
      minHeight: "90%",
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },

    emptyStateContainer: {
      flex: 1,
      minHeight: "90%",
      justifyContent: "center",
      alignItems: "center",
    },

    emptyStateText: {
      textAlign: "center",
      color: theme.colors.onSurfaceVariant,
    },

    groupTitle: {
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },

    groupEntriesContainer: {
      gap: theme.spacing.sm,
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView>
        <View style={styles.childContainer}>
          <ScreenHeader screenHeaderTitle={"Browse favorites"} />

          {favoritesGrouped.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Text variant="bodyMedium" style={styles.emptyStateText}>
                {
                  "Your favorites list is empty.\nTap the heart to add your first favorite."
                }
              </Text>
            </View>
          )}

          {favoritesGrouped.map((group) => (
            <View key={group.title} style={styles.groupEntriesContainer}>
              <Text variant="titleMedium" style={styles.groupTitle}>
                {group.title}
              </Text>

              <View style={styles.groupEntriesContainer}>
                {group.entries.map((entry) => (
                  <EntryCard key={entry.id} entryMetaData={entry} />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
