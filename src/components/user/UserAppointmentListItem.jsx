import React from "react";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const renderDateWithCalendarView = () => {
  const year = "2024";
  const month = "Jan";
  const date = "10";

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#f55344",
          color: "#ffffff",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
      >
        <Typography variant="subtitle2">{year}</Typography>
      </div>
      <div
        style={{
          backgroundColor: "#f5efed",
          borderBottomLeftRadius: "4px",
          borderBottomRightRadius: "4px",
        }}
      >
        <div style={{ fontWeight: 600 }}>
          <Typography variant="h6">{date}</Typography>
        </div>
        <div style={{ fontWeight: 600 }}>
          <Typography variant="subtitle2">{month}</Typography>
        </div>
      </div>
    </div>
  );
};

const UserAppointmentListItem = () => {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3}>
            {renderDateWithCalendarView("2024", "10", "Jan")}
          </Grid>
          <Grid item xs={3}>
            <Stack>
              <Typography>Test Name</Typography>
              <Chip label="Pending" />
              <Typography>Test Name</Typography>
            </Stack>
          </Grid>
          <Grid item xs={3}>
            <Button size="small" variant="contained" color="inherit">
              View
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserAppointmentListItem;
