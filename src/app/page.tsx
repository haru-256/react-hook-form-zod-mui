import { Box } from "@mui/material";
import FormGroup from "@/components/FormGroup";

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
      <FormGroup />
    </Box>
  );
}
