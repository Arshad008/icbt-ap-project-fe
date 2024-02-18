import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import GroupIcon from "@mui/icons-material/Group";
import ScienceIcon from "@mui/icons-material/Science";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import VaccinesIcon from "@mui/icons-material/Vaccines";

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

  return (
    <Container style={{ marginTop: "15px" }}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">Welcome Admin</Typography>
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              {renderCardItem(
                <GroupIcon style={{ fontSize: "32px" }} />,
                "Manage Staffs",
                () => {
                  navigate("/admin/dashboard/staffs");
                }
              )}
            </Grid>
            <Grid item xs={6} sm={4} md={3} lg={2}>
              {renderCardItem(
                <ScienceIcon style={{ fontSize: "32px" }} />,
                "Manage Tests",
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
            <Grid item xs={6} sm={4} md={3} lg={2}>
              {renderCardItem(
                <VaccinesIcon style={{ fontSize: "32px" }} />,
                "Collect Samples",
                () => {
                  navigate("/admin/dashboard/collect-sample");
                }
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StaffDashboard;
