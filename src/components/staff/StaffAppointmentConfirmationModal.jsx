import React from "react";
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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

const StaffAppointmentConfirmationModal = ({ open, onClose }) => {
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
                placeholder="07/06/06/2024"
                label="Appointment Number"
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  defaultValue={moment()}
                  format="YYYY / MMMM / DD / hh:mm A"
                  label="Date & Time *"
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ padding: "30px" }}>
        <Button variant="contained" color="success">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StaffAppointmentConfirmationModal;
