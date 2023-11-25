import { createTheme, darken } from "@mui/material/styles";
import deepGreen from "@mui/material/colors/green";
import deepGrey from "@mui/material/colors/grey";
import deepPurple from "@mui/material/colors/deepPurple";

export const primaryColor = deepGreen[600];
export const secondaryColor = deepPurple[900];

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: primaryColor, // SeaGreen
    },

    text: {
      primary: deepGrey[50], // White
      secondary: deepGrey[500], // LightGrey
    },
    secondary: {
      main: secondaryColor, // DarkGreen
    },
    background: {
      default: darken(deepGrey[900], 0.5),
      paper: deepGrey[800], // Dark paper background
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryColor, // SeaGreen
    },
    secondary: {
      main: secondaryColor, // DarkGreen
    },
    background: {
      default: deepGrey[100], // Light background color
      paper: deepGrey[50], // Light paper background
    },
  },
});

export default darkTheme;
