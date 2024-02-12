import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const AppHeader = () => {
  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Photos
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default AppHeader;
