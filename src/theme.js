import { createTheme } from "@mui/material";

export const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});
