import React from "react";
import {
  Button,
  Card,
  CardActionArea,
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
// Icons
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Components
import UserAppointmentListItem from "../../components/user/UserAppointmentListItem";

const styles = {
  containerStyles: {
    marginTop: '15px',
    // padding: "15px",
  },
};

const appointments = [{}];

const UserProfile = () => {
  return (
    <Container style={styles.containerStyles}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">Welcome User</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h4">My Appointments</Typography>
            </Grid>
            {appointments.length ? (
              appointments.map((item) => (
                <Grid item xs={12} key={item.id}>
                  <UserAppointmentListItem />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography variant="h6">
                  No appointments are available yet.
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UserProfile;
