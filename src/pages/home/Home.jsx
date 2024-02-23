import React, { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  ImageList,
  ImageListItem,
  Stack,
  Step,
  StepIcon,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment/moment";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import DomainAddIcon from "@mui/icons-material/DomainAdd";
import EditNoteIcon from "@mui/icons-material/EditNote";

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

const steps = [
  {
    label: "Book an Appointment",
    icon: CalendarMonthIcon,
  },
  {
    label: "Do the Test",
    icon: MonitorHeartIcon,
  },
  {
    label: "Get the Results",
    icon: TextSnippetIcon,
  },
];

const itemData = [
  {
    img: "https://d2jx2rerrg6sh3.cloudfront.net/images/Article_Images/ImageForArticle_22064_16436342404173431.jpg",
    title: "img-1",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://www.crbgroup.com/wp-content/uploads/2020/04/Lab-Site-Selection-2.jpg",
    title: "img-2",
  },
  {
    img: "https://clpmag.com/wp-content/uploads/2022/09/clinical-laboratory-technician.jpg",
    title: "img-3",
  },
  {
    img: "https://aul.edu.ng/static/images/reviews/mls.jpg",
    title: "img-4",
    cols: 2,
  },
  {
    img: "https://blog.labtag.com/wp-content/uploads/2021/01/0087-Starting-a-New-Lab.jpg",
    title: "img-5",
    cols: 2,
  },
  {
    img: "https://abes.ca/wp-content/uploads/2020/04/what-does-a-medical-laboratory-assistant-do.jpg",
    title: "img-6",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSs6n1rrP46ezGJQSTjG8-HLWfS2zJo2ynagg&usqp=CAU",
    title: "img-7",
  },
  {
    img: "https://sdticampus.lk/wp-content/uploads/2021/03/Medical-Laboratory-Technology.png",
    title: "img-8",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYhDtecLoKEBzvVi966j7MR4mFqcQKqTZ10A&usqp=CAU",
    title: "img-9",
    rows: 2,
    cols: 2,
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk2UquTX1S8V_dyYPmvXx67njMxR6RxtybeQ&usqp=CAU",
    title: "img-10",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuatpBbGKk3WlFP0s1zfVyolczo0Lck5GTaw&usqp=CAU",
    title: "img-11",
  },
  {
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMBHmR870H-TRvp5LJI4uVnt9p54XK8bjlgw&usqp=CAU",
    title: "img-12",
    cols: 2,
  },
];

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

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
      <div
        style={{
          width: "calc(100% - 60px)",
          margin: "15px",
          padding: "30px 15px",
          backgroundColor: "rgba(0,0,0,0.04)",
          borderRadius: "7px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography textAlign="center" variant="h4">
              The Process Is Very Easy!
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Stepper activeStep={1} orientation="vertical">
                {steps.map((item, index) => {
                  return (
                    <Step active key={index}>
                      <StepLabel
                        StepIconComponent={item.icon}
                        StepIconProps={{
                          sx: { fontSize: "30px" },
                          color: "primary",
                        }}
                      >
                        <Typography fontWeight={600}>{item.label}</Typography>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </div>
          </Grid>
        </Grid>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <div>
          <Typography variant="h6" textAlign="center" fontWeight={600}>
            View our facilities
          </Typography>
        </div>
        <ImageList variant="quilted" cols={4} rowHeight={121}>
          {itemData.map((item) => (
            <ImageListItem
              key={item.img}
              cols={item.cols || 1}
              rows={item.rows || 1}
            >
              <img
                {...srcset(item.img, 121, item.rows, item.cols)}
                alt={item.title}
                loading="lazy"
                style={{ borderRadius: "7px" }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
      <div
        style={{
          width: "calc(100% - 60px)",
          margin: "15px",
          padding: "30px 15px",
          backgroundColor: "rgba(0,0,0,0.04)",
          borderRadius: "7px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography textAlign="center" variant="h4">
              Contact Us
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack textAlign="center" alignItems="center">
              <SupportAgentIcon color="primary" sx={{ fontSize: "64px" }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Contact mobile unit
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack textAlign="center" alignItems="center">
              <DomainAddIcon color="primary" sx={{ fontSize: "64px" }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Find the nearest place
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Stack textAlign="center" alignItems="center">
              <EditNoteIcon color="primary" sx={{ fontSize: "64px" }} />
              <Typography variant="subtitle1" fontWeight={600}>
                Submit Inquiries
              </Typography>
            </Stack>
          </Grid>
        </Grid>
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
