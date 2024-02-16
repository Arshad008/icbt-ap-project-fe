import React, { useContext, useState } from "react";
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

import { isEmailValid } from "../../helpers/Strings";
import { Api, apiPaths } from "../../api";
import { StoreContext } from "../../store";
import { useAlert } from "../../components/alert/AlertProvider";

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
  const showAlert = useAlert();
  const { store, setStore } = useContext(StoreContext);

  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: moment().subtract(18, "years"),
    gender: "Male",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    isChecked: false,
    errors: [],
  });

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

  const handleDateOfBirth = (date) => {
    setState((prevState) => ({
      ...prevState,
      dateOfBirth: date,
    }));
  };

  const handlePhoneNumberChange = (event) => {
    const { value } = event.target;

    const re = /^[0-9\b]+$/;

    if (event.target.value === "" || re.test(event.target.value)) {
      setState((prevState) => ({
        ...prevState,
        phoneNumber: value,
      }));
    }
  };

  const handleCheckChange = (event) => {
    const { checked } = event.target;

    setState((prevState) => ({
      ...prevState,
      isChecked: checked,
    }));
  };

  const handleSubmit = () => {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      email,
      phoneNumber,
      password,
      address,
    } = state;

    const errors = [];

    setState((prevState) => ({
      ...prevState,
      errors,
    }));

    if (!firstName.trim().length) {
      errors.push("First name is required");
    } else if (firstName.trim().length < 3) {
      errors.push("Invalid first name");
    }

    if (!lastName.trim().length) {
      errors.push("Last name is required");
    } else if (lastName.trim().length < 3) {
      errors.push("Invalid last name");
    }

    if (!dateOfBirth) {
      errors.push("Date of birth is required");
    }

    if (!gender) {
      errors.push("Gender is required");
    }

    if (!email.trim().length) {
      errors.push("Email is required");
    } else if (!isEmailValid(email)) {
      errors.push("Invalid email");
    }

    if (!phoneNumber.trim().length) {
      errors.push("Phone number is required");
    } else if (phoneNumber.trim().length < 6) {
      errors.push("Invalid phone number");
    }

    if (!password.trim().length) {
      errors.push("Password is required");
    } else if (password.trim().length < 8) {
      errors.push("Password should contain atleast 8 characters");
    }

    if (!address.trim().length) {
      errors.push("Address is required");
    } else if (address.trim().length < 5) {
      errors.push("Invalid address");
    }

    setState((prevState) => ({
      ...prevState,
      errors,
    }));

    if (!errors.length) {
      updateStore({
        isLoading: true,
      });

      const apiData = {
        gender,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: dateOfBirth.format("YYYY-MM-DD"),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
      };

      Api.post(apiPaths.user.signUpUser, apiData)
        .then((res) => {
          showAlert({
            severity: "success",
            message: "Registered successully",
          });

          updateStore({
            isLoading: false,
          });

          navigate("/login");
        })
        .catch((err) => {
          let errMessage = "User registration failed";

          if (err.response && err.response.data && err.response.data.message) {
            errMessage = err.response.data.message;
          }

          showAlert({
            severity: "error",
            message: errMessage,
          });

          updateStore({
            isLoading: false,
          });
        });
    }
  };

  return (
    <div style={styles.containerStyles}>
      <div style={{ maxWidth: "600px", padding: "15px" }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">User Registration</Typography>
              </Grid>
              {state.errors.length ? (
                <Grid item xs={12}>
                  <Typography
                    component="ul"
                    sx={{
                      border: "1px solid red",
                      borderRadius: "4px",
                      paddingTop: "15px",
                      paddingBottom: "15px",
                    }}
                  >
                    {state.errors.map((item, index) => (
                      <Typography
                        key={index}
                        component="li"
                        variant="caption"
                        color="error.main"
                      >
                        {item}
                      </Typography>
                    ))}
                  </Typography>
                </Grid>
              ) : null}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    name="firstName"
                    placeholder="John"
                    label="First Name *"
                    value={state.firstName}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    name="lastName"
                    placeholder="Doe"
                    label="Last Name *"
                    value={state.lastName}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      value={state.dateOfBirth}
                      format="YYYY / MMMM / DD"
                      label="Date of birth *"
                      maxDate={moment()}
                      onChange={handleDateOfBirth}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <TextField
                    select
                    name="gender"
                    value={state.gender}
                    label="Gender"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    name="email"
                    placeholder="johndoe@gmail.com"
                    label="Email *"
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    type="tel"
                    name="phoneNumber"
                    placeholder="0771234567"
                    label="Phone number *"
                    value={state.phoneNumber}
                    onChange={handlePhoneNumberChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    name="password"
                    type="password"
                    placeholder="Qwe123@#$"
                    label="Password *"
                    value={state.password}
                    InputLabelProps={{ shrink: true }}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    multiline
                    rows={3}
                    name="address"
                    placeholder="17/3 A, Lake road, Colombo"
                    label="Address *"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="center">
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={state.isChecked}
                        onChange={handleCheckChange}
                      />
                    }
                    label="I Accept terms and conditions"
                  />
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  disabled={!state.isChecked || store.isLoading}
                  onClick={handleSubmit}
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
