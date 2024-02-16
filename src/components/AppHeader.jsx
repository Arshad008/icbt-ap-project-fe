import React from "react";
import {
  AppBar,
  Collapse,
  LinearProgress,
  Toolbar,
  Typography,
} from "@mui/material";

const AppHeader = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ABC Labs
          </Typography>
        </Toolbar>
        <Collapse
          sx={{
            position: "fixed",
            top: {
              xs: "calc(56px - 4px)",
              sm: "calc(64px - 4px)",
            },
            width: "100%",
          }}
        >
          <LinearProgress color="inherit" />
        </Collapse>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default AppHeader;
