import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";

import StaffAppointmentConfirmationModal from "../../components/staff/StaffAppointmentConfirmationModal";

const StaffAppointments = () => {
  const [state, setState] = useState({
    selectedAppointment: undefined,
    isConfirmationModalOpen: false,
  });

  const openConfirmationModal = (selectedAppointment) => {
    setState((prevState) => ({
      ...prevState,
      selectedAppointment,
      isConfirmationModalOpen: true,
    }));
  };

  const closeConfirmationModal = () => {
    setState((prevState) => ({
      ...prevState,
      selectedAppointment: undefined,
      isConfirmationModalOpen: false,
    }));
  };

  return (
    <Container style={{ marginTop: "15px" }}>
      <Card>
        <CardContent>
          <div style={{ marginBottom: "15px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4">Appointments</Typography>
              </Grid>
            </Grid>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <Stack
              direction="row"
              alignItems="center"
              style={{ maxWidth: "400px" }}
            >
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    defaultValue={moment()}
                    format="YYYY / MMMM / DD"
                    label="Filter by date"
                  />
                </LocalizationProvider>
              </FormControl>
              <FormControl style={{ marginLeft: "10px" }}>
                <Button variant="contained" color="inherit">
                  Filter
                </Button>
              </FormControl>
            </Stack>
          </div>
          <div>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography>Customer 01</Typography>
                    <Typography>Test name</Typography>
                    <Typography>10: 53</Typography>
                    <Typography>pending</Typography>
                    <Button
                      variant="contained"
                      onClick={() => openConfirmationModal()}
                    >
                      Confirm
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      {/* Modals */}
      {state.isConfirmationModalOpen ? (
        <StaffAppointmentConfirmationModal
          open={state.isConfirmationModalOpen}
          onClose={closeConfirmationModal}
        />
      ) : null}
    </Container>
  );
};

export default StaffAppointments;
