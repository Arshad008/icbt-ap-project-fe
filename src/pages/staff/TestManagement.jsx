import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
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
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

import { StoreContext } from "../../store";
import { Api, apiPaths } from "../../api";
import AddTestModal from "../../components/staff/AddTestModal";

const TestManagement = () => {
  const confirm = useConfirm();
  const { store, setStore } = useContext(StoreContext);

  const [selectedTestData, setSelectedTestData] = useState(undefined);
  const [isAddTestModalOpen, setAddTestModalOpen] = useState(false);
  const [isViewTestModalOpen, setViewTestModalOpen] = useState(false);
  const [list, setList] = useState([]);

  useEffect(() => {
    getTestList();
  }, []);

  const updateStore = (attributes = {}) => {
    setStore((prevState) => ({
      ...prevState,
      ...attributes,
    }));
  };

  const toggleAddTestModal = () => {
    setAddTestModalOpen(!isAddTestModalOpen);
  };

  const onTestAdded = (apiData) => {
    updateStore({
      isLoading: true,
    });

    Api.post(apiPaths.test.base, apiData)
      .then(() => {
        getTestList();

        updateStore({
          isLoading: false,
        });
      })
      .catch(() => {
        updateStore({
          isLoading: false,
        });
      });

    setAddTestModalOpen(false);
  };

  const getTestList = () => {
    updateStore({
      isLoading: true,
    });

    Api.get(apiPaths.test.base)
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

  const handleDeleteTest = async (testData) => {
    const confirmed = await confirm({
      description: "Do you want to delete this test data?",
    })
      .then(() => true)
      .catch(() => false);

    if (confirmed) {
      updateStore({
        isLoading: true,
      });

      Api.delete(`${apiPaths.test.base}?id=${testData.id}`)
        .then(() => {
          getTestList();

          updateStore({
            isLoading: false,
          });
        })
        .catch(() => {
          updateStore({
            isLoading: false,
          });
        });
    }
  };

  const openViewTestDataModal = (testData) => {
    setSelectedTestData(testData);
    setViewTestModalOpen(true);
  };

  const closeViewTestDataModal = () => {
    setSelectedTestData(undefined);
    setViewTestModalOpen(false);
  };

  return (
    <Container style={{ marginTop: "15px" }}>
      <Card>
        <CardContent>
          <div style={{ marginBottom: "15px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h5">Test Management</Typography>
              </Grid>
              <Grid item xs={12}>
                <Stack alignItems="flex-end">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={toggleAddTestModal}
                  >
                    Add New Test
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
                    <TableCell style={{ fontWeight: 600 }}>Test Name</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>
                      Test Description
                    </TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Fee</TableCell>
                    <TableCell style={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map((item, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell scope="row">{item.name}</TableCell>
                        <TableCell scope="row">{item.description}</TableCell>
                        <TableCell scope="row">
                          {item.price ? `LKR ${parseFloat(item.price).toFixed(2)}` : ""}
                        </TableCell>
                        <TableCell scope="row" width={150}>
                          <Stack spacing={2}>
                            <Button
                              variant="outlined"
                              color="inherit"
                              size="small"
                              onClick={() => openViewTestDataModal(item)}
                            >
                              View Test Data
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleDeleteTest(item)}
                            >
                              Delete
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
      {isAddTestModalOpen ? (
        <AddTestModal
          open={isAddTestModalOpen}
          onClose={toggleAddTestModal}
          onSubmit={onTestAdded}
        />
      ) : null}
      {isViewTestModalOpen && selectedTestData ? (
        <Dialog open={isViewTestModalOpen} onClose={closeViewTestDataModal}>
          <DialogTitle>Test Details</DialogTitle>
          <IconButton
            aria-label="close"
            onClick={closeViewTestDataModal}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div>
                  <Typography fontWeight={600}>Test Name</Typography>
                </div>
                <div>
                  <Typography>{selectedTestData.name}</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <Typography fontWeight={600}>Test Description</Typography>
                </div>
                <div>
                  <Typography>{selectedTestData.description}</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  <Typography fontWeight={600}>Test Fee</Typography>
                </div>
                <div>
                  <Typography>{selectedTestData.price} (LKR)</Typography>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={600}>Test Labels</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography component="ul">
                  {selectedTestData.testLabels &&
                  selectedTestData.testLabels.length
                    ? selectedTestData.testLabels.map((item, index) => {
                        return (
                          <Typography key={index} component="li">
                            {item}
                          </Typography>
                        );
                      })
                    : null}
                </Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      ) : null}
    </Container>
  );
};

export default TestManagement;
