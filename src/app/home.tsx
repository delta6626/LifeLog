import { ScrollView, StyleSheet, View } from "react-native";

import { randomUUID } from "expo-crypto";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { DeleteEntryModal } from "../../components/DeleteEntryModal";
import { EntryCard } from "../../components/EntryCard";
import { HomeTopBar } from "../../components/HomeTopBar";
import { InsightsCard } from "../../components/InsightsCard";
import { useCurrentEntryStore } from "../../store/currentEntryStore";
import { useEntryScreenModeStore } from "../../store/entryScreenModeStore";
import { useMetaDataStore } from "../../store/metaDataStore";
import { EntryMetaData } from "../../types/EntryMetaData";
import {
  addNewEntryMetaData,
  createNewEntryFile,
} from "../../utils/crudHelpers";
import { getGreetingText } from "../../utils/getGreetingText";
import { useAppTheme } from "../../utils/useAppTheme";

export default function HomeScreen() {
  const theme = useAppTheme();

  const { metaDataList, setMetaDataList, refreshMetaData } = useMetaDataStore();
  const { setCurrentEntryId } = useCurrentEntryStore();
  const { setEntryScreenMode } = useEntryScreenModeStore();

  const styles = StyleSheet.create({
    parentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.xl,
    },

    greetingText: {
      marginTop: theme.spacing.md,
      color: theme.colors.onPrimaryContainer,
    },

    featureButtonContainer: {
      flexDirection: "row",
      marginTop: theme.spacing.sm,
      gap: theme.spacing.md,
    },

    mainTitle: {
      marginTop: theme.spacing.xl,
      marginBottom: theme.spacing.sm,
      color: theme.colors.onPrimaryContainer,
    },
  });

  const handleFavoriteButtonPress = () => {
    router.navigate("/favorites");
  };

  const handleNewMemoryButtonPress = async () => {
    const entryMetaData: EntryMetaData = {
      id: randomUUID(),
      isFavorite: false,
      title: "New memory",
      preview: "",
      wordCount: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await addNewEntryMetaData(entryMetaData);
    await createNewEntryFile(entryMetaData);

    setCurrentEntryId(entryMetaData.id);
    setEntryScreenMode("create");
    router.navigate("/entry");
  };

  useFocusEffect(
    useCallback(() => {
      refreshMetaData();
      setCurrentEntryId(null);
    }, [setMetaDataList]),
  );

  return (
    <SafeAreaView style={styles.parentContainer}>
      <DeleteEntryModal />

      <ScrollView>
        <HomeTopBar />

        <Text variant={"titleMedium"} style={styles.greetingText}>
          {getGreetingText()}
        </Text>

        <InsightsCard />

        <View style={styles.featureButtonContainer}>
          <Button mode={"outlined"} onPress={handleFavoriteButtonPress}>
            Favorites
          </Button>

          <Button
            icon={"plus"}
            mode={"contained"}
            style={{ flex: 1 }}
            onPress={handleNewMemoryButtonPress}
          >
            New memory
          </Button>
        </View>

        <View>
          <Text variant={"titleLarge"} style={styles.mainTitle}>
            Your memories
          </Text>

          {/* <Text
            variant={"titleMedium"}
            style={{
              marginBottom: theme.spacing.sm,
            }}
          >
            Today
          </Text> */}

          {metaDataList.map((metaData) => {
            return <EntryCard key={metaData.id} entryMetaData={metaData} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
