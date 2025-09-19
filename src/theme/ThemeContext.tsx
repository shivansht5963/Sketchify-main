import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from './theme';
import CssBaseline from '@mui/material/CssBaseline';

// Define the context shape
interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleColorMode: () => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleColorMode: () => {},
});

// Custom hook to use the theme context
export const useThemeMode = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Use localStorage to persist theme choice
  const storedMode = localStorage.getItem('theme-mode');
  const [mode, setMode] = useState<'light' | 'dark'>(
    storedMode === 'dark' ? 'dark' : 'light'
  );
  
  // Toggle between light and dark mode
  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  };
  
  // Check for system preference on initial render
  useEffect(() => {
    // Only set based on system preference if no stored preference exists
    if (!storedMode) {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDarkMode ? 'dark' : 'light');
      localStorage.setItem('theme-mode', prefersDarkMode ? 'dark' : 'light');
    }
  }, [storedMode]);
  
  // Create the MUI theme based on the current mode
  const theme = React.useMemo(() => createTheme(mode), [mode]);
  
  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}; 