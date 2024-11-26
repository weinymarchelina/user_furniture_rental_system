"use client"; // Ensure this is a client component for Material UI compatibility

import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#003459",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

export default function ThemeProvider({ children }) {
  return (
    <div
      style={{
        backgroundImage:
          'url("https://www.transparenttextures.com/patterns/redox-02.png")',
        backgroundRepeat: "repeat",
        minHeight: "100vh", // Ensure the background covers the full viewport height
      }}
    >
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </div>
  );
}
