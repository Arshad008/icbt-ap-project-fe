import React, { useContext, useEffect, useState } from "react";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import {
  addAuthUserDataToLocalStorage,
  getAuthUserDataFromLocalStorage,
} from "../../helpers/localStorage";
import { Api, apiPaths } from "../../api";
import { StoreContext } from "../../store";
import { useAlert } from "../../components/alert/AlertProvider";
import { isEmailValid } from "../../helpers/Strings";

const styles = {
  containerStyles: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const Login = () => {
  const showAlert = useAlert();
  const navigate = useNavigate();

  const { store, setStore } = useContext(StoreContext);
  const [state, setState] = useState({
    email: "",
    password: "",
    role: "User",
  });

  const emailValid = isEmailValid(state.email);

  const updateStore = (attributes = {}) => {
    setStore((prevState) => ({
      ...prevState,
      ...attributes,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const redirectUrl = "/profile";
    const apiData = {
      email: state.email.trim(),
      password: state.password,
      role: state.role,
    };

    updateStore({
      isLoading: true,
    });

    Api.post(apiPaths.login, apiData)
      .then((res) => {
        addAuthUserDataToLocalStorage(res.data.id, res.data.role);

        updateStore({
          isLoading: false,
          authUser: res.data,
        });
        navigate(redirectUrl);
      })
      .catch(() => {
        showAlert({
          severity: "error",
          message: "Login failed: please check your email and password",
        });

        updateStore({
          isLoading: false,
        });
      });
  };

  if (store.authUser) {
    return <Navigate to="/profile" />;
  }

  return (
    <div style={styles.containerStyles}>
      <div style={{ maxWidth: "600px", padding: "15px" }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">Login</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    error={!emailValid && Boolean(state.password.length)}
                    name="email"
                    value={state.email}
                    placeholder="johndoe@gmail.com"
                    label="Email *"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleInputChange}
                    helperText={
                      !emailValid && Boolean(state.password.length)
                        ? "Email is invalid"
                        : undefined
                    }
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    name="password"
                    value={state.password}
                    placeholder="Qwe123@#$"
                    label="Password *"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center">
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled={
                      !state.email.trim().length ||
                      !state.password.trim().length ||
                      !emailValid ||
                      store.isLoading
                    }
                    onClick={handleSubmit}
                  >
                    Sign in
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography textAlign="center">
                  Don't have an account?{" "}
                  <NavLink to="/register" style={{ color: "#000000" }}>
                    <Typography component="span">
                      <b>Register</b>
                    </Typography>
                  </NavLink>
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
