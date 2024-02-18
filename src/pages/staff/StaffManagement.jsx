import React, { useContext, useEffect, useState } from "react";
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
import AddIcon from "@mui/icons-material/Add";
import { useConfirm } from "material-ui-confirm";

import { Api, apiPaths } from "../../api";
import { StoreContext } from "../../store";
import { useAlert } from "../../components/alert/AlertProvider";
import AddStaffModal from "../../components/AddStaffModal";

const StaffManagement = () => {
  const confirm = useConfirm();
  const showAlert = useAlert();
  const { store, setStore } = useContext(StoreContext);

  const [isAddStaffModalOpen, setAddStaffModalOpen] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    getStaffList();
  }, []);

  const updateStore = (attributes = {}) => {
    setStore((prevState) => ({
      ...prevState,
      ...attributes,
    }));
  };

  const toggleAddStaffModal = () => {
    setAddStaffModalOpen(!isAddStaffModalOpen);
  };

  const onRegisterStaff = (apiData) => {
    updateStore({
      isLoading: true,
    });

    Api.post(apiPaths.staff.base, apiData)
      .then(() => {
        updateStore({
          isLoading: false,
        });

        getStaffList();
      })
      .catch((err) => {
        if (err.response && err.response.data && err.response.data.message) {
          showAlert({
            severity: "error",
            message: err.response.data.message,
          });
        } else {
          showAlert({
            severity: "error",
            message: "Staff registration failed",
          });
        }
        updateStore({
          isLoading: false,
        });
      });

    toggleAddStaffModal();
  };

  const getStaffList = () => {
    updateStore({
      isLoading: true,
    });

    Api.get(apiPaths.staff.base)
      .then((res) => {
        if (res.data && res.data.length) {
          setList(res.data);
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

  const toggleStatus = async (userData, status) => {
    const confirmed = await confirm({
      description: "Do you want to update user status?",
    })
      .then(() => true)
      .catch(() => false);

    if (confirmed) {
      updateStore({
        isLoading: true,
      });

      const apiData = {
        status,
        id: userData.id,
      };

      Api.put(apiPaths.staff.updateStatus, apiData)
        .then(() => {
          updateStore({
            isLoading: false,
          });

          getStaffList();
        })
        .catch(() => {
          updateStore({
            isLoading: false,
          });

          getStaffList();
        });
    }
  };

  return (
    <Container style={{ marginTop: "15px" }}>
      <Card>
        <CardContent>
          <div style={{ marginBottom: "15px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">Staff Management</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack alignItems="flex-end">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={toggleAddStaffModal}
                  >
                    Add New Staff
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </div>
          <div>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 600 }}>Name</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Phone Number
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Registered At
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map((item, index) => {
                    let isActionDisabled = item.id === store.authUser.id;

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell scope="row">{item.name}</TableCell>
                        <TableCell scope="row">{item.email}</TableCell>
                        <TableCell scope="row">{item.phoneNumber}</TableCell>
                        <TableCell scope="row">{item.createdAt}</TableCell>
                        <TableCell scope="row">
                          <Chip
                            color={
                              item.status === "Active" ? "success" : "error"
                            }
                            label={item.status}
                          />
                        </TableCell>
                        <TableCell scope="row">
                          {item.status === "Active" ? (
                            <Button
                              variant="text"
                              color="error"
                              size="small"
                              disabled={isActionDisabled}
                              onClick={() => toggleStatus(item, "Disabled")}
                            >
                              Disable
                            </Button>
                          ) : (
                            <Button
                              variant="text"
                              color="info"
                              size="small"
                              onClick={() => toggleStatus(item, "Active")}
                            >
                              Enable
                            </Button>
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
      {/* Modals */}
      {isAddStaffModalOpen ? (
        <AddStaffModal
          open={isAddStaffModalOpen}
          onClose={toggleAddStaffModal}
          onSubmit={onRegisterStaff}
        />
      ) : null}
    </Container>
  );
};

export default StaffManagement;
