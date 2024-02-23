import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment";

import { StoreContext } from "../../store";
import { Api, apiPaths } from "../../api";
import { useAlert } from "../../components/alert/AlertProvider";
import { getFormatedAppointmentNumber } from "../../helpers/Strings";

const ViewAppointment = () => {
  const showAlert = useAlert();
  const confirm = useConfirm();
  const [searchParams, setSearchParams] = useSearchParams();
  const { store, setStore } = useContext(StoreContext);

  const [state, setState] = useState({
    appointmentNumber: "",
    appointment: undefined,
    doctorName: "",
    testData: [],
  });

  const authUser = store.authUser;
  const urlAppointmentNumber = searchParams.get("number") || "";
  const hasActionPermissions = ["Admin", "Lab Assistant"].includes(
    authUser.subRole
  );

  const hasActionPermissionsForUpdateTestData =
    ["Admin", "Lab Technician"].includes(authUser.subRole) &&
    state.appointment &&
    state.appointment.status === "Sample Collected";

  let appointmentNumber = "";
  let userName = "";
  let ageData = "";
  let userEmail = "";
  let userPhoneNumber = "";
  let userAddress = "";
  let appointmentDate = "";
  let testName = "";
  let testDescription = "";
  let testPrice = "";
  let appointmentStatus = "";
  let appointmentStatusColor = "warning";

  if (state.appointment) {
    const _appointment = state.appointment;
    const appointmentUser = _appointment.user;
    const appointmentTest = _appointment.test;

    appointmentNumber = getFormatedAppointmentNumber(_appointment.number);
    appointmentStatus = _appointment.status;
    appointmentDate = moment(_appointment.appointmentDate).format(
      "YYYY MMMM DD ddd hh:mm A"
    );

    if (appointmentStatus !== "Pending") {
      appointmentStatusColor = "success";
    }

    if (appointmentUser) {
      const age = moment().diff(appointmentUser.dateOfBirth, "years");

      userName = `${appointmentUser.firstName} ${appointmentUser.lastName}`;
      ageData = `${age} Years (${moment(appointmentUser.dateOfBirth).format(
        "YYYY MMMM DD ddd"
      )})`;

      userEmail = appointmentUser.email;
      userPhoneNumber = appointmentUser.phoneNumber;
      userAddress = appointmentUser.address;
    }

    if (appointmentTest) {
      testName = appointmentTest.name;
      testDescription = appointmentTest.description;
      testPrice = `LKR ${parseFloat(appointmentTest.price).toFixed(2)}`;
    }
  }

  useEffect(() => {
    if (urlAppointmentNumber && parseFloat(urlAppointmentNumber) > 0) {
      setState((prevState) => ({
        ...prevState,
        appointmentNumber: urlAppointmentNumber,
      }));

      getAppointmentDetails(urlAppointmentNumber);
    }
  }, []);

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

  const updateDoctorName = () => {
    if (state.appointment) {
      const apiData = {
        id: state.appointment.id,
        doctorName: state.doctorName,
      };

      updateStore({
        isLoading: true,
      });

      Api.put(apiPaths.appointment.adminUpdateDoctor, apiData)
        .then((res) => {
          if (res.data) {
            setState((prevState) => ({
              ...prevState,
              appointment: res.data,
            }));
          }

          updateStore({
            isLoading: false,
          });

          showAlert({
            severity: "success",
            message: "Appointment updated",
          });
        })
        .catch(() => {
          updateStore({
            isLoading: false,
          });
        });
    }
  };

  const getAppointmentDetails = (number) => {
    setState((prevState) => ({
      ...prevState,
      appointment: undefined,
      doctorName: "",
    }));

    const aptNumber = number || state.appointmentNumber;

    if (aptNumber && parseFloat(aptNumber) > 0) {
      updateStore({
        isLoading: true,
      });

      Api.get(`${apiPaths.appointment.base}/${aptNumber}`)
        .then((res) => {
          if (res.data) {
            setState((prevState) => {
              let _doctorName = "";
              let _testData = [];

              if (res.data.test && res.data.test.testLabels.length) {
                res.data.test.testLabels.forEach((item) => {
                  _testData.push({
                    label: item,
                    value: "",
                  });
                });
              }

              if (res.data.doctorName) {
                _doctorName = res.data.doctorName;
              }

              if (res.data.testData) {
                _testData = res.data.testData;
              }

              return {
                ...prevState,
                appointment: res.data,
                doctorName: _doctorName,
                testData: _testData,
              };
            });
          } else {
            showAlert({
              severity: "error",
              message: "Appointment not found",
            });
          }

          updateStore({
            isLoading: false,
          });
        })
        .catch(() => {
          updateStore({
            isLoading: false,
          });

          showAlert({
            severity: "error",
            message: "Appointment not found",
          });
        });
    }
  };

  const collectSample = async () => {
    const confired = await confirm({
      description: "You want to continue?",
    })
      .then(() => true)
      .catch(() => false);

    if (state.appointment && confired) {
      const apiData = {
        id: state.appointment.id,
        status: "Sample Collected",
      };

      updateStore({
        isLoading: true,
      });

      Api.put(apiPaths.appointment.adminUpdateStatus, apiData)
        .then((res) => {
          if (res.data) {
            setState((prevState) => ({
              ...prevState,
              appointment: res.data,
            }));
          }

          showAlert({
            severity: "success",
            message: "Sample collected",
          });

          updateStore({
            isLoading: false,
          });
        })
        .catch(() => {
          updateStore({
            isLoading: false,
          });
        });
    }
  };

  const handleTestDataValueChange = (event, itemIndex) => {
    const { value } = event.target;

    const newTestData = [...(state.testData || [])];
    newTestData[itemIndex].value = value;

    setState((prevState) => ({
      ...prevState,
      testData: newTestData,
    }));
  };

  const handleConfirmResult = async () => {
    const { appointment, testData } = state;

    const confirmed = await confirm({
      description: "Do you want to confirm the result?",
    })
      .then(() => true)
      .catch(() => false);

    if (confirmed && appointment) {
      updateStore({
        isLoading: true,
      });

      const apiData = {
        id: appointment.id,
        testData,
      };

      Api.put(apiPaths.appointment.adminUpdateTestData, apiData)
        .then((res) => {
          if (res.data) {
            setState((prevState) => ({
              ...prevState,
              appointment: res.data,
            }));
          }

          showAlert({
            severity: "success",
            message: "Test result updated",
          });

          updateStore({
            isLoading: false,
          });
        })
        .catch(() => {
          showAlert({
            severity: "error",
            message: "Update test result failed",
          });

          updateStore({
            isLoading: false,
          });
        });
    }
  };

  return (
    <Container style={{ marginTop: "15px" }}>
      <div style={{ marginBottom: "15px" }}>
        <Typography variant="h4">Find Appointment</Typography>
      </div>
      <div style={{ maxWidth: "400px", marginBottom: "30px" }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={9} sm={10}>
            <FormControl fullWidth>
              <TextField
                type="number"
                name="appointmentNumber"
                placeholder="5698"
                label="Appointment Number (APT)"
                InputLabelProps={{ shrink: true }}
                value={state.appointmentNumber}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Button
              variant="contained"
              color="inherit"
              disabled={
                !state.appointmentNumber ||
                !(
                  state.appointmentNumber &&
                  parseFloat(state.appointmentNumber) > 0
                )
              }
              onClick={() => getAppointmentDetails()}
            >
              Find
            </Button>
          </Grid>
        </Grid>
      </div>
      {state.appointment ? (
        <div>
          <div style={{ marginBottom: "30px" }}>
            <Card elevation={3}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Chip
                      label={
                        <Typography variant="subtitle2">
                          <b>Appointment Date:</b> {appointmentDate}
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Chip
                      color={appointmentStatusColor}
                      label={
                        <Typography variant="subtitle2">
                          <b>Appointment Status:</b> {appointmentStatus}
                        </Typography>
                      }
                    />
                  </Grid>
                  {appointmentNumber ? (
                    <Grid item xs={12}>
                      <Typography variant="h6">{appointmentNumber}</Typography>
                    </Grid>
                  ) : null}
                  <Grid item xs={12}>
                    <Typography variant="h6">Customer Details</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <Typography fontWeight={600}>Name</Typography>
                      <Typography>{userName}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <Typography fontWeight={600}>Age & DOB</Typography>
                      <Typography>{ageData}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <Typography fontWeight={600}>Email</Typography>
                      <Typography>{userEmail}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <Typography fontWeight={600}>Phone Number</Typography>
                      <Typography>{userPhoneNumber}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <Typography fontWeight={600}>Address</Typography>
                      <Typography>{userAddress}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
          <div style={{ marginBottom: "30px" }}>
            <Card elevation={3}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Test Details</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <Typography fontWeight={600}>Test Name</Typography>
                      <Typography>{testName}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <Typography fontWeight={600}>Test Description</Typography>
                      <Typography>{testDescription}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack>
                      <Typography fontWeight={600}>Test Price</Typography>
                      <Typography>{testPrice}</Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
          {appointmentStatus !== "Pending" ? (
            <div style={{ marginBottom: "30px" }}>
              <Card elevation={3}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Recommended Doctor</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <TextField
                          name="doctorName"
                          value={state.doctorName}
                          label="Doctor Name"
                          placeholder="Enter here..."
                          InputLabelProps={{ shrink: true }}
                          onChange={handleInputChange}
                          InputProps={{ readOnly: !hasActionPermissions }}
                        />
                      </FormControl>
                    </Grid>
                    {hasActionPermissions ? (
                      <Grid item xs={12}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="info"
                          onClick={updateDoctorName}
                          disabled={
                            !state.doctorName.trim().length ||
                            state.doctorName.trim().length < 3 ||
                            store.isLoading
                          }
                        >
                          Update
                        </Button>
                      </Grid>
                    ) : null}
                    {hasActionPermissions ? (
                      <>
                        <Grid item xs={12}>
                          <Divider />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            color="success"
                            disabled={appointmentStatus === "Sample Collected"}
                            onClick={collectSample}
                          >
                            Collect Samples
                          </Button>
                        </Grid>
                      </>
                    ) : null}
                  </Grid>
                </CardContent>
              </Card>
            </div>
          ) : null}
          {hasActionPermissionsForUpdateTestData ? (
            <div style={{ marginBottom: "30px" }}>
              <Card elevation={3}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">Test Data</Typography>
                    </Grid>
                    {state.testData && state.testData.length
                      ? state.testData.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              <Grid item xs={12}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={600}
                                >
                                  {item.label}
                                </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <FormControl fullWidth>
                                  <TextField
                                    defaultValue={item.value}
                                    placeholder="Enter here..."
                                    onChange={(event) =>
                                      handleTestDataValueChange(event, index)
                                    }
                                  />
                                </FormControl>
                              </Grid>
                            </React.Fragment>
                          );
                        })
                      : null}
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={handleConfirmResult}
                        disabled={
                          !state.testData.length ||
                          (state.testData.length &&
                            state.testData.some(
                              (item) => !item.value.trim().length
                            ))
                        }
                      >
                        {state.appointment.testData
                          ? "Update Result"
                          : "Confirm Result"}
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          ) : null}
        </div>
      ) : null}
    </Container>
  );
};

export default ViewAppointment;
