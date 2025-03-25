import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import HighVol from "./HighVol";
import LowVol from "./LowVol";

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

const FlexContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(4),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const FlexItem = styled(Box)({
  flex: 1,
  minWidth: 0, // This ensures that the flex item can shrink below its minimum content size
});

export default function AppScreenVol() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Screener", path: "/screener" }, { name: "Volatilidade" }]} />
      </Box>

      <SimpleCard title="Screener de Volatilidade">
        <FlexContainer>
          <FlexItem>
            <HighVol />
          </FlexItem>
          <FlexItem>
            <LowVol />
          </FlexItem>
        </FlexContainer>
      </SimpleCard>
    </Container>
  );
}