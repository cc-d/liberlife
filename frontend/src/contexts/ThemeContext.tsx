import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { ThemeProvider as MuiThemeProvider, Theme } from '@mui/material/styles';

import { darkTheme, lightTheme } from '../app/theme';

type DarkLight = 'dark' | 'light';

interface ThemeContextType {
  currentTheme: DarkLight;
  toggleTheme: () => void;
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// ThemeProvider component
interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const locTheme = (localStorage.getItem('theme') || 'dark') as DarkLight;
  const [currentTheme, setCurrentTheme] = useState<DarkLight>(locTheme);

  const toggleTheme = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', nextTheme);
    setCurrentTheme(nextTheme);
  };

  const theme = currentTheme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
