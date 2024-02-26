import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import ReactDOMServer from "react-dom/server";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import html2pdf from "html3pdf";

import { StoreContext } from "../../store";
import { Api, apiPaths } from "../../api";
import { getFormatedAppointmentNumber } from "../../helpers/Strings";

const styles = {
  containerStyles: {
    marginTop: "15px",
  },
};

const appointments = [];

const UserProfile = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const { store, setStore } = useContext(StoreContext);
  const [appointments, setAppointments] = useState([]);

  const authUser = store.authUser;

  let authUserName = "";

  if (authUser) {
    authUserName = authUser.firstName || "";

    if (authUser.lastName) {
      authUserName += ` ${authUser.lastName}`;
    }
  }

  useEffect(() => {
    getAppointmentsForUser();
  }, []);

  const updateStore = (attributes = {}) => {
    setStore((prevState) => ({
      ...prevState,
      ...attributes,
    }));
  };

  const getAppointmentsForUser = () => {
    const apiData = { userId: authUser.id };

    updateStore({
      isLoading: true,
    });

    Api.post(apiPaths.appointment.userList, apiData)
      .then((res) => {
        if (res.data && res.data.length) {
          setAppointments(res.data);
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

  const renderLabReportView = (appointment) => {
    const userName = `${appointment.user.firstName} ${appointment.user.lastName}`;
    const date = moment(appointment.appointmentDate).format(
      "YYYY-MM-DD hh:mm A"
    );

    const appointmentNumber = getFormatedAppointmentNumber(appointment.number);
    const testName = appointment.test.name;

    return (
      <div style={{ padding: "15px" }}>
        <Stack style={{ marginBottom: "15px" }}>
          <h4 style={{ textAlign: "center" }}>ABC LABS - Lab Report</h4>
        </Stack>
        <Stack style={{ marginBottom: "15px" }}>
          <Typography>Name: {userName}</Typography>
          <Typography>Date: {date}</Typography>
          <Typography>Appointment Number: {appointmentNumber}</Typography>
        </Stack>
        <Stack style={{ marginBottom: "15px" }}>
          <h4 style={{ textAlign: "center" }}>{testName}</h4>
        </Stack>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 600 }}>Test Data</TableCell>
                <TableCell style={{ fontWeight: 600 }}>Test Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointment.testData.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell scope="row">{item.label}</TableCell>
                    <TableCell scope="row">{item.value}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack style={{ marginBottom: "15px" }}>
          <h4 style={{ textAlign: "center" }}>Thank you.</h4>
        </Stack>
      </div>
    );
  };

  const downloadLabReport = async (appointment) => {
    const confirmed = await confirm({
      description: "You want to download?",
    })
      .then(() => true)
      .catch(() => false);

    if (confirmed) {
      const jsxElement = renderLabReportView(appointment);
      const htmlString = ReactDOMServer.renderToStaticMarkup(jsxElement);
      const container = document.createElement("div");
      container.innerHTML = htmlString;

      const options = {
        margin: 10,
        filename: "ABC-Lab-Report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf(container, options);
    }
  };

  return (
    <Container style={styles.containerStyles}>
      <Card>
        <CardContent>
          <div style={{ marginBottom: "15px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">
                  Welcome:&nbsp;
                  {authUserName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/")}
                  >
                    Make new Appintment
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4">My Appointments</Typography>
              </Grid>
            </Grid>
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>
                      Booked Date
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Requested Date
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Appointment Number
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
                  {appointments.map((item, index) => {
                    let chipColor = "warning";

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
                        <TableCell scope="row">
                          {moment(item.createdAt).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell scope="row">
                          {moment(item.requestedDate).format("YYYY-MM-DD")}
                        </TableCell>
                        <TableCell scope="row">
                          {getFormatedAppointmentNumber(item.number)}
                        </TableCell>
                        <TableCell scope="row">
                          <Stack>
                            <div>{item.test ? item.test.name : "-"}</div>
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
                        <TableCell>
                          {item.status === "Completed" ? (
                            <Tooltip title="Donwload Lab Report">
                              <IconButton
                                onClick={() => downloadLabReport(item)}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {appointments.length ? null : (
            <div
              style={{
                margin: "30px 0",
                backgroundColor: "rgba(0,0,0,0.04)",
                borderRadius: "7px",
                padding: "30px",
                textAlign: "center",
              }}
            >
              <Typography fontWeight={600}>
                No appointments are booked yet.
              </Typography>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;
