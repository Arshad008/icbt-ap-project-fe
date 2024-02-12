import React from "react";
import { NavLink } from "react-router-dom";
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

const styles = {
  containerStyles: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const Login = () => {
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
                    placeholder="johndoe@gmail.com"
                    label="Email *"
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Qwe123@#$"
                    label="Password *"
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center">
                  <Button fullWidth variant="outlined">
                    Sign in
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="center">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Remember me"
                  />
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
