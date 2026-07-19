import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../components/ScreenHeader";
import { useMetaDataStore } from "../../store/metaDataStore";
import { useAppTheme } from "../../utils/useAppTheme";

export default function FavoritesScreen() {
  const theme = useAppTheme();
  const { metaDataList } = useMetaDataStore();

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
          <ScreenHeader screenHeaderTitle={"Browse favorites"} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
