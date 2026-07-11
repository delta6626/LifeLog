import { Stack } from "expo-router";
import { MD3LightTheme, PaperProvider } from "react-native-paper";

// const customAppTheme = {
//   ...MD3LightTheme,
//   colors: {
//     ...MD3LightTheme.colors,
//     primary: "",
//     secondary: "",
//   },
// };

export default function RootLayout() {
  return (
    // Wrap with PaperProvider to apply material theming globally
    <PaperProvider theme={MD3LightTheme}>
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
