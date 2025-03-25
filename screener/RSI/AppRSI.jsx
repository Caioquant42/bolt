import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import RSISC from "./RSI_SC";
import RSISV from "./RSI_SV";


// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));


export default function AppRSI() {
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "RSI_2", path: "/screener" }, { name: "RSI_3" }]} />
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">
        <Box sx={{ flex: 1, minWidth: "49%", marginRight: 1 }}>
          <RSISC /> {/* RSI - Sobrecomprado */}
        </Box>
        
        <Box sx={{ flex: 1, minWidth: "49%", marginLeft: 1 }}>
          <RSISV /> {/* RSI - Sobrevendido */}
        </Box>
      </Box>
    </Container>
  );
}

