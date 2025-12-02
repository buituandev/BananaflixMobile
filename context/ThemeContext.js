import React, { createContext, useContext, useMemo } from 'react';
import { useMaterialYouPalette } from '@assembless/react-native-material-you';
import { useTheme as usePaperTheme } from 'react-native-paper';

const ThemeContext = createContext();

//With Context (Current): The colors object is calculated once in the Provider and shared with all 50 components in your app.
//Without Context: The colors object is calculated 50 times (once for each component).
//If you wanted to add a feature like a "Toggle Dark Mode" button, you couldn't do it.
//Without a Provider to hold the isDarkMode state, toggling it in one component wouldn't update the others.
const createThemeColors = palette => ({
  background: palette.system_neutral1[11],
  surface: palette.system_neutral2[11],
  surfaceVariant: palette.system_neutral2[10],
  outline: palette.system_neutral2[6],
  border: palette.system_neutral2[8],
  textPrimary: palette.system_neutral1[0],
  textSecondary: palette.system_neutral2[3],
  accent: palette.system_accent1[3],
  accentMuted: palette.system_accent1[7],
  accentOn: palette.system_accent1[11],
  accentContainer: palette.system_accent1[10],
  neutralMuted: palette.system_neutral1[9],
  icon: palette.system_neutral2[3],
  iconMuted: 'rgba(255, 255, 255, 0.08)',
  error: palette.system_error,
  errorBackground: 'rgba(255, 68, 68, 0.1)',
  gradient: [
    palette.system_neutral1[11],
    palette.system_accent1[9],
    palette.system_neutral1[11],
  ],
  statusBarStyle: 'light-content',
});

const createTextInputTheme = (palette, paperTheme, colors) => ({
  ...paperTheme,
  colors: {
    ...paperTheme.colors,
    primary: colors.accent,
    onSurface: colors.textPrimary,
    onSurfaceVariant: colors.textSecondary,
    surfaceVariant: colors.surfaceVariant,
    outline: colors.outline,
    background: 'transparent',
  },
});

export const ThemeProvider = ({ children }) => {
  const palette = useMaterialYouPalette();
  const paperTheme = usePaperTheme();
  const colors = useMemo(() => createThemeColors(palette), [palette]);
  const textInputTheme = useMemo(
    () => createTextInputTheme(palette, paperTheme, colors),
    [palette, paperTheme, colors],
  );

  const value = useMemo(
    () => ({
      palette,
      colors,
      textInputTheme,
    }),
    [palette, colors, textInputTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

