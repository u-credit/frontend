'use client';
import { createTheme, PaletteColorOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customSalmon: Palette['primary'];
  }
  interface PaletteOptions {
    customSalmon?: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    customSalmon: true;
    primaryReverse: true;
  }
}

const globalMuiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      100: '#FEF5E6',
      200: '#F29B6D',
      300: '#EB6D2A',
      400: '#E35205',
      500: '#BB4100',
      main: '#E35205',
      light: '#F29B6D',
      dark: '#BB4100',
      contrastText: '#fff',
    },
    secondary: {
      main: '#BFBFBF',
      light: '#EAEAEA',
      dark: '#A6A6A6',
      contrastText: '#000',
    },
    grey: {
      100: '#F2F2F2',
      200: '#EAEAEA',
      300: '#CFCFCF',
      400: '#BFBFBF',
      500: '#A6A6A6',
      600: '#666666',
      700: '#404040',
      800: '#2A2A2A',
    },
    error: {
      main: '#EB5757',
      light: '#F18383',
      dark: '#C51717',
      contrastText: '#fff',
    },
    success: {
      main: '#00C558',
      light: '#A8FFB2',
      dark: '#00612C',
      contrastText: '#fff',
    },
    info: {
      main: '#2A65FE',
      light: '#5D8AFE',
      dark: '#0137C1',
      darker: '#000',
      contrastText: '#fff',
    },
    warning: {
      main: '#FAC94D',
      light: '#FBD87E',
      dark: '#DA9F06',
      contrastText: '#000',
    },
    customSalmon: {
      main: '#FF6B6B',
      light: '#FF8F8F',
      dark: '#FF4A4A',
      contrastText: '#FFF',
    },
  },
  typography: {
    allVariants: {
      fontFamily: 'bai Jamjuree',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          boxShadow: 'none', // Remove the default shadow
          '&:hover': {
            boxShadow: 'none', // Remove shadow on hover
          },
          '&:active': {
            boxShadow: 'none', // Remove shadow on active state
          },
          '&:focus': {
            boxShadow: 'none', // Remove shadow on focus state
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'Bai Jamjuree',
        },
        label: {
          fontFamily: 'Bai Jamjuree',
        },
        labelSmall: {
          fontFamily: 'Bai Jamjuree',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'none !important',
        },
      },
    },
  },
});

export default globalMuiTheme;
