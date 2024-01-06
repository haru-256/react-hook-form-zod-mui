"use client";

import { useForm } from "react-hook-form";
import { Box, TextField, Button } from "@mui/material";
import { on } from "events";

export default function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <Box
      component={"form"}
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: "1rem",
      }}
    >
      <TextField id="form" label="Name" variant="outlined" required />
      <Button
        type="button"
        variant="contained"
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </Button>
    </Box>
  );
}
