import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { isEmailValid } from "../../helpers/Strings";

const AddStaffModal = ({ open, onClose, onSubmit }) => {
  const [state, setState] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    subRole: "Receptionist",
    errors: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
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

  const handleSubmit = () => {
    const { name, email, phoneNumber, password, subRole } = state;

    const errors = [];

    setState((prevState) => ({
      ...prevState,
      errors,
    }));

    if (!name.trim().length) {
      errors.push("Name is required");
    } else if (name.trim().length < 3) {
      errors.push("Invalid Name");
    }

    if (!subRole) {
      errors.push("Role is required");
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

    setState((prevState) => ({
      ...prevState,
      errors,
    }));

    if (!errors.length) {
      const apiData = {
        password,
        subRole,
        name: name.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
      };

      onSubmit(apiData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register new staff</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <div>
          <Grid container spacing={2}>
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
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  name="name"
                  value={state.name}
                  label="Name *"
                  placeholder="John Doe"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleInputChange}
                />
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
                  select
                  name="subRole"
                  value={state.subRole}
                  label="Role"
                  onChange={handleInputChange}
                >
                  <MenuItem value="Receptionist">Receptionist</MenuItem>
                  <MenuItem value="Lab Assistant">Lab Assistant</MenuItem>
                  <MenuItem value="Lab Technician">Lab Technician</MenuItem>
                  <MenuItem value="Admin">Admin</MenuItem>
                </TextField>
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
          </Grid>
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "30px" }}>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStaffModal;
