import { Box } from "@mui/material";
import Form from "@/components/Form";

export default function Page() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Form />
    </Box>
  );
}
