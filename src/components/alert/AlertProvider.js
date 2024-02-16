import React, { createContext, useContext, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }

  return context;
};

export const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("info");
  const [anchorOrigin, setAnchorOrigin] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const [autoHideDuration, setAutoHideDuration] = useState(6000);

  const showAlert = (props) => {
    setOpen(true);
    setMessage(props.message || "");
    setSeverity(props.severity || "info");
    setAutoHideDuration(props.autoHideDuration || 6000);
    setAnchorOrigin(
      props.anchorOrigin || {
        vertical: "top",
        horizontal: "center",
      }
    );
  };

  const hideAlert = () => {
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={showAlert}>
      {children}
      <Snackbar
        open={open}
        onClose={hideAlert}
        autoHideDuration={autoHideDuration}
        anchorOrigin={anchorOrigin}
      >
        <Alert onClose={hideAlert} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};
