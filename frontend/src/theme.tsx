import { createTheme, darken, lighten } from '@mui/material/styles';
import green from '@mui/material/colors/green';
import purple from '@mui/material/colors/purple';
import grey from '@mui/material/colors/grey';

export const primary = green[900];
export const secondary = purple[900];

const goalBackColor = darken(grey[900], 0.5);

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: primary,
    },

    text: {
      primary: grey[50],
      secondary: darken(grey[50], 0.2),
    },
    secondary: {
      main: secondary,
    },
    background: {
      default: '#000000',
      paper: goalBackColor,
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
      primary: '#050505',
      secondary: lighten('#050505', 0.2),
    },
    background: {
      default: grey[50],
      paper: grey[100],
    },
  },
});

export default darkTheme;
