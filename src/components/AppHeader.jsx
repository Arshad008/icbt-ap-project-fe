import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Collapse,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { StoreContext, initialStore } from "../store";
import { removeLocalStorageData } from "../helpers/localStorage";

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { store, setStore } = useContext(StoreContext);
  const [state, setState] = useState({
    anchorEl: null,
  });

  const open = Boolean(state.anchorEl);
  const authUser = store.authUser;

  const handleClick = (event) => {
    setState((prevState) => ({
      ...prevState,
      anchorEl: event.currentTarget,
    }));
  };

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      anchorEl: null,
    }));
  };

  const onProfileClick = () => {
    navigate("/profile");
    handleClose();
  };

  const onLogout = () => {
    setStore(initialStore);
    removeLocalStorageData();
    navigate("/login");
    handleClose();
  };

  const renderRightButton = () => {
    if (authUser) {
      return (
        <>
          <IconButton
            id="btn-header-user"
            aria-controls={open ? "menu-user-header" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <AccountCircleIcon sx={{ color: "#ffffff" }} />
          </IconButton>
          <Menu
            id="menu-user-header"
            aria-labelledby="btn-header-user"
            anchorEl={state.anchorEl}
            open={open}
            onClose={handleClose}
          >
            {authUser &&
            authUser.role === "User" &&
            location.pathname !== "/profile" ? (
              <MenuItem onClick={onProfileClick}>Profile</MenuItem>
            ) : null}
            <MenuItem onClick={onLogout}>Logout</MenuItem>
          </Menu>
        </>
      );
    }

    if (location.pathname !== "/login") {
      return (
        <Button
          variant="text"
          size="small"
          color="inherit"
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      );
    }

    return null;
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ABC Labs
          </Typography>
          {renderRightButton()}
        </Toolbar>
        <Collapse
          in={store.isLoading}
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
