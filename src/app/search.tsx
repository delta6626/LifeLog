import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import type { CalendarDate } from "react-native-paper-dates/lib/typescript/Date/Calendar";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAppTheme } from "../../utils/useAppTheme";

export default function SearchScreen() {
  const theme = useAppTheme();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [date, setDate] = useState<CalendarDate | undefined>();

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
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView>
        <View style={styles.childContainer}>
          <ScreenHeader screenHeaderTitle={"Search memories"} />

          <View style={styles.inputContainer}>
            <TextInput
              outlineStyle={{
                borderRadius: theme.radii.full,
              }}
              mode={"outlined"}
              multiline={false}
              autoFocus={true}
              placeholder={"Search by title"}
            />

            <Button
              mode={"outlined"}
              onPress={() => {
                setModalOpen(true);
              }}
            >
              Search by Date
            </Button>

            <DatePickerModal
              locale={"en"}
              label={"Select a date"}
              saveLabel={"Show memories"}
              saveLabelDisabled={false}
              validRange={{ endDate: new Date() }}
              mode="single"
              visible={modalOpen}
              onDismiss={() => {
                setModalOpen(false);
                setDate(undefined);
              }}
              date={date}
              onConfirm={() => {}}
              onChange={(dateObject) => {
                setDate(dateObject.date);
                console.log(dateObject.date);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
