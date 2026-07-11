import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  return (
    // Wrap with PaperProvider to apply material theming globally
    <PaperProvider>
      {/* Define screens */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="home" />
        <Stack.Screen name="entries" />
        <Stack.Screen name="search" />
        <Stack.Screen name="favorites" />
      </Stack>
    </PaperProvider>
  );
}
