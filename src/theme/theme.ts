import { createTheme as createMuiTheme, ThemeOptions } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Helper function to create theme with dark/light mode
export const createTheme = (mode: PaletteMode) => {
  // Common theme settings
  const baseTheme: ThemeOptions = {
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        fontSize: '3.5rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '2.5rem',
      },
      h3: {
        fontWeight: 700,
        fontSize: '2rem',
      },
      h4: {
        fontWeight: 700,
        fontSize: '1.5rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.2rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 16px',
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'dark' ? '#1f2937' : '#f1f5f9',
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'dark' ? '#4b5563' : '#cbd5e1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-corner': {
              background: 'transparent',
            },
          },
        },
      },
    },
  };

  // Light mode specific settings
  const lightPalette: ThemeOptions = {
    palette: {
      mode: 'light',
      primary: {
        main: '#4ECDC4',
        dark: '#33B3AA',
        light: '#7AD9D2',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF6B6B',
        dark: '#E54B4B',
        light: '#FF9E9E',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#FFFFFF',
        paper: '#F8FAFC',
      },
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        disabled: '#94A3B8',
      },
      divider: 'rgba(0, 0, 0, 0.12)',
      error: {
        main: '#EF4444',
      },
      warning: {
        main: '#F59E0B',
      },
      info: {
        main: '#0EA5E9',
      },
      success: {
        main: '#10B981',
      },
    },
  };

  // Dark mode specific settings
  const darkPalette: ThemeOptions = {
    palette: {
      mode: 'dark',
      primary: {
        main: '#4ECDC4',
        dark: '#33B3AA',
        light: '#7AD9D2',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF6B6B',
        dark: '#E54B4B',
        light: '#FF9E9E',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#0F172A',
        paper: '#1E293B',
      },
      text: {
        primary: '#F8FAFC',
        secondary: '#CBD5E1',
        disabled: '#64748B',
      },
      divider: 'rgba(255, 255, 255, 0.12)',
      error: {
        main: '#F87171',
      },
      warning: {
        main: '#FBBF24',
      },
      info: {
        main: '#38BDF8',
      },
      success: {
        main: '#34D399',
      },
    },
  };

  // Merge the base theme with the appropriate palette
  return createMuiTheme({
    ...baseTheme,
    ...(mode === 'light' ? lightPalette : darkPalette),
  });
};

export default createTheme('light'); 