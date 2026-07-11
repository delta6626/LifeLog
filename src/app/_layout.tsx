import { Stack } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

const customAppTheme = {
  ...MD3LightTheme,
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    x2l: 32,
    x3l: 48,
  },
};

export default function RootLayout() {
  return (
    // Wrap with PaperProvider to apply material theming globally
    <PaperProvider theme={customAppTheme}>
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
