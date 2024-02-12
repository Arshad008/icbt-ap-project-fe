import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";

const styles = {
  containerStyles: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const UserRegistration = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.containerStyles}>
      <div style={{ maxWidth: "600px", padding: "15px" }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">User Registration</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    placeholder="John"
                    label="First Name *"
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Doe"
                    label="Last Name *"
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      defaultValue={moment()}
                      format="YYYY / MMMM / DD"
                      label="Date of birth *"
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField select value="Male" label="Gender">
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </FormControl>
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
                    placeholder="0771234567"
                    label="Phone number *"
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
                <FormControl fullWidth>
                  <TextField
                    multiline
                    rows={3}
                    placeholder="17/3 A, Lake road, Colombo"
                    label="Address *"
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="center">
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="I Accept terms and conditions"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/")}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserRegistration;
