import { ScrollView, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useAppTheme } from "../../utils/useAppTheme";

export default function SearchScreen() {
  const theme = useAppTheme();

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },

    childContainer: {
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },
  });

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView>
        <View style={styles.childContainer}>
          <ScreenHeader screenHeaderTitle={"Search memories"} />

          <View>
            <TextInput
              outlineStyle={{
                borderRadius: theme.radii.full,
              }}
              mode={"outlined"}
              multiline={false}
              autoFocus={true}
              placeholder={"Search by title"}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
