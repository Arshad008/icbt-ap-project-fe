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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

const ReportGenerateModal = ({ open, onClose, onSubmit }) => {
  const [state, setState] = useState({
    start: null,
    end: null,
  });

  const handleStartChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      start: value,
    }));
  };

  const handleEndChange = (value) => {
    setState((prevState) => ({
      ...prevState,
      end: value,
    }));
  };

  const handleSubmit = () => {
    if (state.start && state.end) {
      const startDate = state.start.startOf("day").format("YYYY-MM-DD HH:mm");
      const endDate = state.end.endOf("day").format("YYYY-MM-DD HH:mm");

      onSubmit({
        startDate,
        endDate,
      });
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
            <Grid item xs={12}>
              <Typography variant="h6">Select a date range</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    value={state.start}
                    format="YYYY / MMMM / DD"
                    label="Start *"
                    minDate={moment().subtract(1, "year")}
                    onChange={handleStartChange}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    value={state.end}
                    format="YYYY / MMMM / DD"
                    label="End *"
                    minDate={state.start}
                    onChange={handleEndChange}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "30px" }}>
        <Button
          variant="contained"
          color="success"
          disabled={!state.start || !state.end}
          onClick={handleSubmit}
        >
          Generate
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportGenerateModal;
