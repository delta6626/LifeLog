// LifeLog - A cross-platform React Native app for day-to-day personal journaling.
// Copyright (c) 2026 Mahamudul Hasan

import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { en, registerTranslation } from "react-native-paper-dates";
import { theme } from "../../utils/theme";

export default function RootLayout() {
  registerTranslation("en", en);

  return (
    // Wrap with PaperProvider to apply material theming globally
    <PaperProvider theme={theme}>
      {/* Define screens */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="entry" />
        <Stack.Screen name="search" />
        <Stack.Screen name="favorites" />
      </Stack>
    </PaperProvider>
  );
}
