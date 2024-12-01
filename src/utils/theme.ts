import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#A67B5B",
      contrastText: "#ffffff", // Ensure contrastText is defined
    },
    secondary: {
      main: "#FED8B1",
      contrastText: "#000000", // Ensure contrastText is defined
    },
    error: {
      main: red.A400,
      contrastText: "#ffffff", // Ensure contrastText is defined
    },
  },
});

export default theme;
