import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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

import { StoreContext } from "../../store";
import { Api, apiPaths } from "../../api";
import { useAlert } from "../../components/alert/AlertProvider";
import PaymentModal from "../../components/user/PaymentModal";

const styles = {
  containerStyles: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
};

const Home = () => {
  const showAlert = useAlert();
  const navigate = useNavigate();
  const { store, setStore } = useContext(StoreContext);

  const [testList, setTestList] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [date, selectedDate] = useState(moment());

  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);

  const authUser = store.authUser;
  const testOptions = testList.map((item) => {
    return {
      label: item.name,
      value: item.id,
      data: item,
    };
  });

  useEffect(() => {
    getTestList();
  }, []);

  const togglePaymentModal = () => {
    setPaymentModalOpen(!isPaymentModalOpen);
  };

  const getTestList = () => {
    updateStore({
      isLoading: true,
    });

    Api.get(apiPaths.test.base)
      .then((res) => {
        if (res.data && res.data.length) {
          setTestList(res.data);
        }

        updateStore({
          isLoading: false,
        });
      })
      .catch(() => {
        updateStore({
          isLoading: false,
        });
      });
  };

  const updateStore = (attributes = {}) => {
    setStore((prevState) => ({
      ...prevState,
      ...attributes,
    }));
  };

  const onBookNow = () => {
    if (authUser) {
      if (authUser.role === "User") {
        setPaymentModalOpen(true);
      }
    } else {
      navigate("/login");
    }
  };

  const onPaymentSuccess = () => {
    updateStore({
      isLoading: true,
    });

    const apiData = {
      testId: selectedTest.value,
      date: date.format("YYYY-MM-DD"),
      userId: authUser.id,
    };

    Api.post(apiPaths.appointment.base, apiData)
      .then(() => {
        showAlert({
          severity: "success",
          message: "Appointment booked successfully",
        });

        updateStore({
          isLoading: false,
        });

        navigate("/profile");
      })
      .catch(() => {
        showAlert({
          severity: "error",
          message: "Appointment booking failed",
        });

        updateStore({
          isLoading: false,
        });
      });
  };

  if (store.authUser && store.authUser.role === "Staff") {
    return <Navigate to="/admin/dashboard" />;
  }

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
                    disableClearable
                    value={selectedTest}
                    options={testOptions}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => setSelectedTest(value)}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value.value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Test Name *"
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
                      value={date}
                      format="YYYY / MMMM / DD"
                      label="Date"
                      minDate={moment()}
                      onChange={(value) => selectedDate(value)}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={onBookNow}
                  disabled={!authUser || !selectedTest}
                >
                  {!authUser ? "Please login to book" : "Book Now"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
      {isPaymentModalOpen && selectedTest ? (
        <PaymentModal
          open={isPaymentModalOpen}
          onClose={togglePaymentModal}
          testData={selectedTest.data}
          onPaymentSuccess={onPaymentSuccess}
        />
      ) : null}
    </div>
  );
};

export default Home;
