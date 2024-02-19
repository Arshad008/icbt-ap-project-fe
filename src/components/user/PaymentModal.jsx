import React, { useEffect, useState } from "react";
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
import { usePaymentInputs } from "react-payment-inputs";
import CloseIcon from "@mui/icons-material/Close";

import { getFormatedNumberWithCommas } from "../../helpers/Strings";

const PaymentModal = ({ open, onClose, testData, onPaymentSuccess }) => {
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();

  const [state, setState] = useState({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    isCardInvalid: true,
  });

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      isCardInvalid: Boolean(meta.error),
    }));
  }, [meta.error]);

  const handleChangeCardNumber = (event) => {
    setState((prevState) => ({
      ...prevState,
      cardNumber: event.target.value,
    }));
  };

  const handleChangeExpiryDate = (event) => {
    setState((prevState) => ({
      ...prevState,
      expiryDate: event.target.value,
    }));
  };

  const handleChangeCVC = (event) => {
    setState((prevState) => ({
      ...prevState,
      cvc: event.target.value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Payment Details</DialogTitle>
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
              <Stack style={{ marginBottom: "15px" }}>
                <Typography variant="subtitle2" fontWeight={600}>
                  Test Name
                </Typography>
                <Typography variant="subtitle2">{testData.name}</Typography>
              </Stack>
              <Stack>
                <Typography variant="subtitle2" fontWeight={600}>
                  Test Description
                </Typography>
                <Typography variant="subtitle2">
                  {testData.description}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">
                {getFormatedNumberWithCommas(testData.price)} LKR
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <div style={{ marginBottom: "15px" }}>
                <Typography>
                  Please complete the payment in order to book an Appointment.
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  label="Card Number"
                  value={state.cardNumber}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    ...getCardNumberProps({ onChange: handleChangeCardNumber }),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="Expiry Date"
                  value={state.expiryDate}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    ...getExpiryDateProps({ onChange: handleChangeExpiryDate }),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <TextField
                  label="CVC"
                  value={state.cvc}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{
                    ...getCVCProps({ onChange: handleChangeCVC }),
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                {meta.isTouched && meta.error && (
                  <Typography variant="caption" color="error.main">
                    Error: {meta.error}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "30px" }}>
        <Button
          disabled={state.isCardInvalid || !meta.isTouched}
          variant="contained"
          color="success"
          onClick={() => onPaymentSuccess()}
        >
          Pay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
