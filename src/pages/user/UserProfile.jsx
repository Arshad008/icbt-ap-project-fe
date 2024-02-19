import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Chip,
  Container,
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
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";

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
    updateStore({
      isLoading: true,
    });

    Api.get(`${apiPaths.appointment.base}/${authUser.id}`)
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appointments.map((item, index) => {
                    let chipColor = "warning";

                    if (item.status === "Confirmed") {
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
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;
