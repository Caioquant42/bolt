import { useState } from "react";
import { Box, Radio, styled, Typography } from "@mui/material";
import { green } from "@mui/material/colors";

// STYLED COMPONENTS
const GreenRadio = styled(Radio)(() => ({
  color: green[400],
  "&$checked": { color: green[600] }
}));

export default function StandaloneRadio({ onPeriodChange }) {
  const [selectedValue, setSelectedValue] = useState("12");

  function handleChange(event) {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    onPeriodChange(parseInt(newValue));
  }

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box textAlign="center">
        <Radio
          value="6"
          color="secondary"
          onChange={handleChange}
          name="radio-button-demo"
          checked={selectedValue === "6"}
        />
        <Typography variant="body2">6</Typography>
      </Box>

      <Box textAlign="center">
        <Radio
          value="12"
          color="secondary"
          onChange={handleChange}
          name="radio-button-demo"
          checked={selectedValue === "12"}
        />
        <Typography variant="body2">12</Typography>
      </Box>

      <Box textAlign="center">
        <Radio
          value="24"
          color="secondary"
          onChange={handleChange}
          name="radio-button-demo"
          checked={selectedValue === "24"}
        />
        <Typography variant="body2">24</Typography>
      </Box>

      <Box textAlign="center">
        <Radio
          value="36"
          color="secondary"
          onChange={handleChange}
          name="radio-button-demo"
          checked={selectedValue === "36"}
        />
        <Typography variant="body2">36</Typography>
      </Box>
    </Box>
  );
}
