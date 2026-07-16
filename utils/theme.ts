import { MD3LightTheme } from "react-native-paper";

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    background: "#F6F5EE",
    onBackground: "#242A1F",
    surface: "#FFFFFF",
    onSurface: "#242A1F",
    onSurfaceVariant: "#5F6B57",
    primary: "#5B7052",
    onPrimary: "#FFFFFF",
    primaryContainer: "#DCE3D0",
    onPrimaryContainer: "#43543D",
    tertiary: "#C1673D",
    onTertiary: "#FFFFFF",
    outline: "#DAD9C8",
    muted: "#919b88",
    error: "#D32F2F",
    errorContainer: "#FDECEA",
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    x2l: 32,
    x3l: 48,
  },

  radii: {
    none: 0,
    xs: 1.5,
    sm: 2,
    md: 6,
    lg: 8,
    xl: 12,
    x2l: 16,
    x3l: 24,
    x4l: 32,
    full: 9999,
  },
};
