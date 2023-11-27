import { createTheme, darken, lighten } from '@mui/material/styles';
import green from '@mui/material/colors/green';
import purple from '@mui/material/colors/purple';
import grey from '@mui/material/colors/grey';

export const primary = green[900];
export const secondary = purple[900];

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primary,
    },

    text: {
      primary: grey[50],
      secondary: grey[200],
    },
    secondary: {
      main: secondary,
    },
    background: {
      default: darken(grey[900], 1),
      paper: darken(grey[900], 0.4),
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    text: {
      primary: darken(grey[900], 0.8),
      secondary: darken(grey[900], 0.4),
    },
    background: {
      default: grey[50],
      paper: grey[100],
    },
  },
});

export default darkTheme;
