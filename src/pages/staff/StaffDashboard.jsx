import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import ScienceIcon from "@mui/icons-material/Science";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VaccinesIcon from "@mui/icons-material/Vaccines";

import { StoreContext } from "../../store";

const renderCardItem = (icon, title, onClick) => {
  return (
    <Card>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Stack alignItems="center">
            {icon}
            <br />
            <Typography variant="caption" textAlign="center" fontWeight={600}>
              {title}
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { store, setStore } = useContext(StoreContext);

  const authUser = store.authUser;

  let authUserName = "";
  let authUserRole = "";

  if (authUser) {
    if (authUser.name) {
      authUserName = authUser.name;
    }
    if (authUser.subRole) {
      authUserRole = authUser.subRole;
    }
  }

  const updateStore = (attributes = {}) => {
    setStore((prevState) => ({
      ...prevState,
      ...attributes,
    }));
  };

  const adminOnlyPermission = authUser && authUser.subRole === "Admin";
  const collectSamplePermission =
    adminOnlyPermission || (authUser && authUser.subRole === "Lab Assistant");

  return (
    <Container style={{ marginTop: "15px" }}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">
                Welcome back! &nbsp;
                {authUserName}
                &nbsp;
                <Chip
                  size="small"
                  color="info"
                  variant="outlined"
                  label={`Role: ${authUserRole}`}
                />
              </Typography>
            </Grid>
            {adminOnlyPermission ? (
              <Grid item xs={6} sm={4} md={3} lg={2}>
                {renderCardItem(
                  <GroupIcon style={{ fontSize: "32px" }} />,
                  "Manage Staffs",
                  () => {
                    navigate("/admin/dashboard/staffs");
                  }
                )}
              </Grid>
            ) : null}
            <Grid item xs={6} sm={4} md={3} lg={2}>
              {renderCardItem(
                <ScienceIcon style={{ fontSize: "32px" }} />,
                "View Tests",
                () => {
                  navigate("/admin/dashboard/tests");
                }
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              {renderCardItem(
                <CalendarMonthIcon style={{ fontSize: "32px" }} />,
                "View Appointments",
                () => {
                  navigate("/admin/dashboard/appointments");
                }
              )}
            </Grid>
            {collectSamplePermission ? (
              <Grid item xs={6} sm={4} md={3} lg={2}>
                {renderCardItem(
                  <VaccinesIcon style={{ fontSize: "32px" }} />,
                  "Collect Samples",
                  () => {
                    navigate("/admin/dashboard/appointments/view");
                  }
                )}
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StaffDashboard;
