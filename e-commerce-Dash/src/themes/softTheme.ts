import { grey } from "@mui/material/colors";
import { defaultTheme } from "react-admin";

export const softDarkTheme = {
  palette: {
    primary: {
      main: "#FF8C99",
    },
    secondary: {
      main: "#5C6BC0",
    },
    mode: "dark" as "dark",
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
  sidebar: {
    width: 200,
  },
  components: {
    ...defaultTheme.components,
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          borderInlineStart: "3px solid #000",
          "&.RaMenuItemLink-active": {
            borderInlineStart: "3px solid #FF8C99",
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {},
    },
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          color: "#ffffffb3",
          backgroundColor: "#616161",
        },
      },
      defaultProps: {
        elevation: 1,
      },
    },
    RaToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: grey[800],
        },
      },
    },
  },
};

export const softLightTheme = {
  palette: {
    primary: {
      main: "#FF7483",
    },
    secondary: {
      light: "#7986CB",
      main: "#3F51B5",
      dark: "#1A237E",
      contrastText: "#fff",
    },
    success: {
      main: "#FF7483",
      light: "#FFE0E3",
    },
    background: {
      default: "#fcfcfe",
    },
    mode: "light" as "light",
  },
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
  shape: {
    borderRadius: 10,
  },
  sidebar: {
    width: 200,
  },
  components: {
    ...defaultTheme.components,
    RaMenuItemLink: {
      styleOverrides: {
        root: {
          borderInlineStart: "3px solid #fff",
          "&.RaMenuItemLink-active": {
            borderInlineStart: "3px solid #FF7483",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation1: {
          boxShadow: "none",
        },
        root: {
          border: "1px solid #e0e0e3",
          backgroundClip: "padding-box",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorSecondary: {
          color: "#808080",
          backgroundColor: "#fff",
        },
      },
      defaultProps: {
        elevation: 1,
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#f5f5f5",
        },
        barColorPrimary: {
          backgroundColor: "#d7d7d7",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:last-child td": { border: 0 },
        },
      },
    },
    RaToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: grey[300],
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: "#FFE0E3",
          color: "#8C3A42",
          "& .MuiAlert-icon": {
            color: "#FF7483",
          },
        },
      },
    },
  },
};
