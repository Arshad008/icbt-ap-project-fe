import React from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const StaffCollectSample = () => {
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
                placeholder="05/16/06/2024"
                label="Appointment Number"
                InputLabelProps={{ shrink: true }}
              />
            </FormControl>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Button variant="contained" color="inherit">
              Find
            </Button>
          </Grid>
        </Grid>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography>Customer info</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography>Test c</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
      <div style={{ marginBottom: "30px" }}>
        <Card>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Test info</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Test c</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Doctor</Typography>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Enter here."
                    label="Doctor name"
                    InputLabelProps={{ shrink: true }}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
      <div style={{ marginBottom: "15px" }}>
        <Button variant="contained" color="info">
          Collect Sample
        </Button>
      </div>
    </Container>
  );
};

export default StaffCollectSample;
