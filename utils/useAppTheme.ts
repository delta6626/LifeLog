import { useTheme } from "react-native-paper";
import type { AppTheme } from "../types/AppTheme";

export const useAppTheme = () => useTheme<AppTheme>();
