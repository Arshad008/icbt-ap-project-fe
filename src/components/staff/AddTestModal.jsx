import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const AddTestModal = ({ open, onClose, onSubmit }) => {
  const confirm = useConfirm();

  const [state, setState] = useState({
    name: "",
    description: "",
    price: "",
    testLabels: [""],
    errors: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onAddField = () => {
    const newTestLabels = [...state.testLabels];
    newTestLabels.push("");

    setState((prevState) => ({
      ...prevState,
      testLabels: newTestLabels,
    }));
  };

  const handleLabelChange = (event, index) => {
    const { value } = event.target;

    const newTestLabels = [...state.testLabels];

    newTestLabels[index] = value;

    setState((prevState) => ({
      ...prevState,
      testLabels: newTestLabels,
    }));
  };

  const handleDeleteTestLabel = async (itmeIndex) => {
    const confirmed = await confirm({
      description: "Do you want to delete this test data?",
    })
      .then(() => true)
      .catch(() => false);

    if (confirmed) {
      const newTestLabels = [...state.testLabels].filter((item, index) => {
        return index !== itmeIndex;
      });

      setState((prevState) => ({
        ...prevState,
        testLabels: newTestLabels,
      }));
    }
  };

  const handleSubmit = () => {
    const { name, description, price, testLabels } = state;

    const errors = [];
    const newTestLabels = testLabels.filter((item) => item.trim());

    if (!name.trim().length) {
      errors.push("Test name is required");
    }

    if (!description.length) {
      errors.push("Description is required");
    }

    if (!price.length) {
      errors.push("Price is required");
    }

    if (!newTestLabels.length) {
      errors.push("Test label is required");
    }

    setState((prevState) => ({
      ...prevState,
      errors,
    }));

    if (!errors.length) {
      const apiData = {
        name,
        description,
        price,
        testLabels: newTestLabels,
      };

      onSubmit(apiData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Register new staff</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <div>
          <Grid container spacing={2}>
            {state.errors.length ? (
              <Grid item xs={12}>
                <Typography
                  component="ul"
                  sx={{
                    border: "1px solid red",
                    borderRadius: "4px",
                    paddingTop: "15px",
                    paddingBottom: "15px",
                  }}
                >
                  {state.errors.map((item, index) => (
                    <Typography
                      key={index}
                      component="li"
                      variant="caption"
                      color="error.main"
                    >
                      {item}
                    </Typography>
                  ))}
                </Typography>
              </Grid>
            ) : null}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  name="name"
                  value={state.name}
                  label="Test Name *"
                  placeholder="Enter here..."
                  InputLabelProps={{ shrink: true }}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  multiline
                  rows={3}
                  name="description"
                  value={state.description}
                  label="Test Description *"
                  placeholder="Enter here..."
                  InputLabelProps={{ shrink: true }}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField
                  type="number"
                  name="price"
                  value={state.price}
                  label="Test Fee (LKR)*"
                  placeholder="Enter here..."
                  InputLabelProps={{ shrink: true }}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Test Labels</Typography>
            </Grid>
            {state.testLabels && state.testLabels.length
              ? state.testLabels.map((item, index) => {
                  const selectedValue = state.testLabels[index];

                  return (
                    <React.Fragment key={index}>
                      <Grid item xs={10}>
                        <FormControl fullWidth>
                          <TextField
                            size="small"
                            value={selectedValue}
                            label="Label"
                            placeholder="Enter here"
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) =>
                              handleLabelChange(event, index)
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={2}>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTestLabel(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </React.Fragment>
                  );
                })
              : null}
            <Grid item xs={12}>
              <Stack alignItems="flex-end">
                <Button
                  variant="contained"
                  color="inherit"
                  size="small"
                  onClick={onAddField}
                >
                  Add Field
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "30px" }}>
        <Button variant="contained" color="success" onClick={handleSubmit}>
          Add Test
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTestModal;
