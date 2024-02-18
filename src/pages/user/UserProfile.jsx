import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { StoreContext } from "../../store";
import UserAppointmentListItem from "../../components/user/UserAppointmentListItem";

const styles = {
  containerStyles: {
    marginTop: "15px",
  },
};

const appointments = [];

const UserProfile = () => {
  const navigate = useNavigate();

  const { store, setStore } = useContext(StoreContext);

  const authUser = store.authUser;

  let authUserName = "";

  if (authUser) {
    authUserName = authUser.firstName || "";

    if (authUser.lastName) {
      authUserName += ` ${authUser.lastName}`;
    }
  }

  return (
    <Container style={styles.containerStyles}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h5">
                Welcome &nbsp;
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
