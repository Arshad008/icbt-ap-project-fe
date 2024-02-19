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
  TextField,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

import { getFormatedAppointmentNumber } from "../../helpers/Strings";

const StaffAppointmentConfirmationModal = ({
  open,
  onClose,
  appointmentData,
  onConfirm,
}) => {
  const [date, setDate] = useState(moment());

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Appointment Confirmation</DialogTitle>
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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                placeholder={getFormatedAppointmentNumber(100)}
                label="Appointment Number"
                InputLabelProps={{ shrink: true }}
                defaultValue={getFormatedAppointmentNumber(
                  appointmentData.number
                )}
                InputProps={{ readOnly: true }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DateTimePicker
                  value={date}
                  format="YYYY / MMMM / DD / ddd / hh:mm A"
                  label="Date & Time *"
                  minDate={moment()}
                  onChange={(value) => setDate(value)}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: "30px" }}>
        <Button
          variant="contained"
          color="success"
          onClick={() => onConfirm(appointmentData, date)}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffAppointmentConfirmationModal;
