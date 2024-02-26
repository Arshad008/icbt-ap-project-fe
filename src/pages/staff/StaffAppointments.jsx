import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Container,
  FormControl,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useConfirm } from "material-ui-confirm";
import moment from "moment";

import { Api, apiPaths } from "../../api";
import { StoreContext } from "../../store";
import { getFormatedAppointmentNumber } from "../../helpers/Strings";
import { useAlert } from "../../components/alert/AlertProvider";
import StaffAppointmentConfirmationModal from "../../components/staff/StaffAppointmentConfirmationModal";
import ReportGenerateModal from "../../components/staff/ReportGenerateModal";

const StaffAppointments = () => {
  const navigate = useNavigate();
  const showAlert = useAlert();
  const confirm = useConfirm();
  const { store, setStore } = useContext(StoreContext);

  const [state, setState] = useState({
    selectedAppointment: undefined,
    isConfirmationModalOpen: false,
    appointments: [],
    date: moment(),
    isReportGenerateModalOpen: false,
  });

  const authUser = store.authUser;

  useEffect(() => {
    getAppointmentsForAdmin();
  }, []);

  const updateStore = (attributes = {}) => {
    setStore((prevState) => ({
      ...prevState,
      ...attributes,
    }));
  };

  const getAppointmentsForAdmin = () => {
    const apiData = {
      date: state.date.format("YYYY-MM-DD"),
    };

    updateStore({
      isLoading: true,
    });

    Api.post(apiPaths.appointment.adminList, apiData)
      .then((res) => {
        if (res.data) {
          setState((prevState) => ({
            ...prevState,
            appointments: res.data || [],
          }));
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

  const openAppointmentConfirmationModal = (item) => {
    setState((prevState) => ({
      ...prevState,
      selectedAppointment: item,
      isConfirmationModalOpen: true,
    }));
  };

  const closeAppointmentConfirmationModal = () => {
    setState((prevState) => ({
      ...prevState,
      selectedAppointment: undefined,
      isConfirmationModalOpen: false,
    }));
  };

  const onConfirmAppointment = (data, date) => {
    const apiData = {
      id: data.id,
      date: date.format("YYYY-MM-DD HH:mm"),
    };

    updateStore({
      isLoading: true,
    });

    Api.post(apiPaths.appointment.adminConfirm, apiData)
      .then(() => {
        showAlert({
          severity: "success",
          message: "Appointment booked successfully",
        });

        getAppointmentsForAdmin();
      })
      .catch(() => {
        showAlert({
          severity: "error",
          message: "Confirm appointment failed",
        });
      });

    closeAppointmentConfirmationModal();
  };

  const toggleReportGenerateModal = () => {
    setState((prevState) => ({
      ...prevState,
      isReportGenerateModalOpen: !state.isReportGenerateModalOpen,
    }));
  };

  const generateReport = (list) => {
    if (list && list.length) {
      const rows = [
        [
          "Total amounts for the appointment",
          "Most purchased test",
          "Pending Appointments",
          "Sample Collected Appointments",
          "Tests Completed",
        ],
      ];

      let totalAmount = 0;
      const testOccurence = {};
      let pending = 0;
      let pendingAmount = 0;
      let sampleCollected = 0;
      let sampleCollectedAmount = 0;
      let completed = 0;
      let completedAmount = 0;

      list.forEach((item) => {
        if (item.test && item.test.price) {
          totalAmount += item.test.price;

          if (item.test) {
            testOccurence[item.test.name] =
              (testOccurence[item.test.name] || 0) + 1;
          }
        }

        if (item.status === "Pending") {
          pending += 1;
          pendingAmount += item.test.price;
        }

        if (item.status === "Sample Collected") {
          sampleCollected += 1;
          sampleCollectedAmount += item.test.price;
        }

        if (item.status === "Completed") {
          completed += 1;
          completedAmount += item.test.price;
        }
      });

      let mostFrequentKey = Object.keys(testOccurence).reduce((a, b) =>
        testOccurence[a] > testOccurence[b] ? a : b
      );

      if (testOccurence[mostFrequentKey]) {
        mostFrequentKey = `${mostFrequentKey} (${testOccurence[mostFrequentKey]}) times`;
      }

      const row = [];
      row.push(
        `LKR ${totalAmount}`,
        mostFrequentKey,
        `${pending} (LKR ${pendingAmount})`,
        `${sampleCollected} (LKR ${sampleCollectedAmount})`,
        `${completed} (LKR ${completedAmount})`
      );

      rows.push(row);

      let csvContent = "data:text/csv;charset=utf-8,";

      rows.forEach(function (rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
      });

      const encodedUri = encodeURI(csvContent);

      window.open(encodedUri);
    }
  };

  const getReportData = async (data) => {
    const apiData = {
      start: data.startDate,
      end: data.endDate,
    };

    updateStore({
      isLoading: true,
    });

    Api.post(apiPaths.appointment.adminGetReportData, apiData)
      .then((res) => {
        if (res && res.data && res.data.length) {
          generateReport(res.data);
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

    toggleReportGenerateModal();
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
                    defaultValue={state.date}
                    format="YYYY / MMMM / DD"
                    label="Filter by date"
                    onChange={(value) =>
                      setState((prevState) => ({ ...prevState, date: value }))
                    }
                  />
                </LocalizationProvider>
              </FormControl>
              <FormControl style={{ marginLeft: "10px" }}>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={() => getAppointmentsForAdmin()}
                >
                  Filter
                </Button>
              </FormControl>
            </Stack>
          </div>
          <Collapse
            in={
              ["Admin"].includes(authUser.subRole) &&
              (state.appointments || []).length > 0
            }
          >
            <div style={{ marginBottom: "15px" }}>
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="info"
                  onClick={toggleReportGenerateModal}
                >
                  Generate Report
                </Button>
              </Stack>
            </div>
          </Collapse>
          <div>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>
                      Requested Date
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Appointment Number
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Customer Name
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Test Name</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Appointment Time
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state.appointments.map((item, index) => {
                    const requestedDate = moment(item.requestedDate).format(
                      "YYYY-MM-DD"
                    );

                    const isDisabled =
                      item.status !== "Pending" ||
                      moment(item.requestedDate) < moment();

                    let customerName = "";
                    let testName = "";
                    let chipColor = "warning";

                    if (item.user && item.user.firstName) {
                      customerName = `${item.user.firstName} ${item.user.lastName}`;
                    }

                    if (item.test && item.test.name) {
                      testName = item.test.name;
                    }

                    if (item.status !== "Pending") {
                      chipColor = "success";
                    }

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell scope="row">{requestedDate}</TableCell>
                        <TableCell scope="row">
                          {getFormatedAppointmentNumber(item.number)}
                        </TableCell>
                        <TableCell scope="row">{customerName}</TableCell>
                        <TableCell scope="row">
                          <Stack>
                            <div>{testName}</div>
                            <div>
                              (
                              {item.test && item.test.price
                                ? item.test.price
                                : "-"}{" "}
                              LKR)
                            </div>
                          </Stack>
                        </TableCell>
                        <TableCell scope="row">
                          <Chip
                            size="small"
                            label={item.status}
                            color={chipColor}
                          />
                        </TableCell>
                        <TableCell scope="row">
                          {item.status !== "Pending" && item.appointmentDate ? (
                            <Typography variant="caption">
                              {moment(item.appointmentDate).format(
                                "YYYY-MM-DD hh:mm A"
                              )}
                            </Typography>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell scope="row">
                          <Stack>
                            {authUser &&
                            ["Receptionist", "Admin"].includes(
                              authUser.subRole
                            ) ? (
                              <Button
                                size="small"
                                disabled={isDisabled}
                                style={{ marginBottom: "10px" }}
                                onClick={() =>
                                  openAppointmentConfirmationModal(item)
                                }
                              >
                                Confirm
                              </Button>
                            ) : null}
                            <Button
                              size="small"
                              color="inherit"
                              onClick={() =>
                                navigate(
                                  `/admin/dashboard/appointments/view?number=${item.number}`
                                )
                              }
                            >
                              View Full Details
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </CardContent>
      </Card>
      {/* Modals */}
      {state.isConfirmationModalOpen ? (
        <StaffAppointmentConfirmationModal
          open={state.isConfirmationModalOpen}
          onClose={closeAppointmentConfirmationModal}
          appointmentData={state.selectedAppointment}
          onConfirm={onConfirmAppointment}
        />
      ) : null}
      {state.isReportGenerateModalOpen ? (
        <ReportGenerateModal
          open={state.isReportGenerateModalOpen}
          onClose={toggleReportGenerateModal}
          onSubmit={getReportData}
        />
      ) : null}
    </Container>
  );
};

export default StaffAppointments;
