import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";
import PaymentModal from "../../components/PaymentModal";

const styles = {
  containerStyles: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const Home = () => {
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const togglePaymentModal = () => {
    setPaymentModalOpen(!isPaymentModalOpen);
  };

  return (
    <div style={styles.containerStyles}>
      <div style={{ maxWidth: "600px", padding: "15px" }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">Book an Appointment</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Autocomplete
                    value={null}
                    options={[]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Test"
                        placeholder="Select a Test"
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      defaultValue={moment()}
                      format="YYYY / MMMM / DD"
                      label="Date *"
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={togglePaymentModal}
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
      {isPaymentModalOpen ? (
        <PaymentModal open={isPaymentModalOpen} onClose={togglePaymentModal} />
      ) : null}
    </div>
  );
};

export default Home;
