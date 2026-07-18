import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import type { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { SafeAreaView } from "react-native-safe-area-context";

import { EntryCard } from "../../components/EntryCard";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useMetaDataStore } from "../../store/metaDataStore";
import { groupEntriesByMonth } from "../../utils/groupEntriesByMonth";
import { isSameCalendarDay } from "../../utils/isSameCalendarDay";
import { useAppTheme } from "../../utils/useAppTheme";

export default function SearchScreen() {
  const theme = useAppTheme();

  const { metaDataList } = useMetaDataStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [date, setDate] = useState<CalendarDate>();
  const [filteredEntries, setFilteredEntries] = useState(metaDataList);

  useEffect(() => {
    const trimmedSearch = searchTitle.trim().toLowerCase();

    if (trimmedSearch === "" && !date) {
      setFilteredEntries([]);
      return;
    }

    const filtered = metaDataList.filter((entry) => {
      const titleMatches =
        trimmedSearch === "" ||
        entry.title.toLowerCase().includes(trimmedSearch);

      const dateMatches =
        !date || isSameCalendarDay(new Date(entry.createdAt), date);

      return titleMatches && dateMatches;
    });

    setFilteredEntries(filtered);
  }, [searchTitle, date, metaDataList]);

  const groupedEntries = useMemo(
    () => groupEntriesByMonth(filteredEntries),
    [filteredEntries],
  );

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    childContainer: {
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },

    inputContainer: {
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },

    groupTitle: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.sm,
    },

    groupEntriesContainer: {
      gap: theme.spacing.sm,
    },

    emptyStateContainer: {
      minHeight: 250,
      justifyContent: "center",
      alignItems: "center",
    },

    emptyStateText: {
      textAlign: "center",
      color: theme.colors.onSurfaceVariant,
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView>
        <View style={styles.childContainer}>
          <ScreenHeader screenHeaderTitle="Search memories" />

          <View style={styles.inputContainer}>
            <TextInput
              value={searchTitle}
              onChangeText={setSearchTitle}
              mode="outlined"
              autoFocus
              placeholder="Search by title"
              outlineStyle={{
                borderRadius: theme.radii.full,
              }}
            />

            <Button mode="outlined" onPress={() => setModalOpen(true)}>
              {date ? date.toLocaleDateString() : "Search by date"}
            </Button>
            {date && (
              <Button mode="text" onPress={() => setDate(undefined)}>
                Clear date
              </Button>
            )}

            <DatePickerModal
              locale="en"
              mode="single"
              visible={modalOpen}
              date={date}
              label="Select a date"
              saveLabel="Show memories"
              saveLabelDisabled={false}
              validRange={{
                endDate: new Date(),
              }}
              onDismiss={() => {
                setModalOpen(false);
              }}
              onConfirm={({ date }) => {
                setDate(date);
                setModalOpen(false);
              }}
            />
          </View>

          {groupedEntries.length === 0 &&
            (searchTitle.trim() !== "" || date) && (
              <View style={styles.emptyStateContainer}>
                <Text variant="bodyMedium" style={styles.emptyStateText}>
                  {"No memories found. Try a different title or date."}
                </Text>
              </View>
            )}

          {searchTitle.trim() == "" && !date && (
            <View style={styles.emptyStateContainer}>
              <Text variant="bodyMedium" style={styles.emptyStateText}>
                {"Start typing or choose a date to search your memories."}
              </Text>
            </View>
          )}

          {groupedEntries.map((group) => (
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
