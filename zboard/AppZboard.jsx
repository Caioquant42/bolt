import React from 'react';
import { Box, styled, useTheme, useMediaQuery, Grid } from "@mui/material";
import SBPage from "./shared/SBPage";
import ScatterPage from "./shared/ScatterPage";
import FluxoEstrangeiroPage from './shared/FluxoEstrangeiroPage';
import PerformancePage from './shared/PerformancePage';
import PearsonPage from './shared/PearsonPage';
import IBOVPieChart from "app/views/recomendations/brasil/IBOVPieChart";

const Container = styled("div")(({ theme }) => ({
  margin: theme.spacing(2),
  [theme.breakpoints.down("sm")]: { 
    margin: theme.spacing(1),
    padding: 0
  },
  "& .breadcrumb": {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: { 
      marginBottom: theme.spacing(1) 
    }
  }
}));

const GridBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1)
  },
  '& > *': {
    minWidth: 0,
    width: '100%'
  }
}));

const ChartCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
  height: '100%',
  overflow: 'hidden'
}));

export default function AppZboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container>
      <GridBox>
        <ChartCard>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <SBPage />
            </Grid>
            <Grid item xs={12} md={12}>
              <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <IBOVPieChart 
                  height={isMobile ? "220px" : "570px"}
                  color={["#28a745", "#007bff", "#ffc107", "#dc3545"]}
                />
              </Box>
            </Grid>
          </Grid>
        </ChartCard>
        
        <ChartCard>
          <ScatterPage />
        </ChartCard>

        <ChartCard>
          <FluxoEstrangeiroPage />
        </ChartCard>

        <ChartCard>
          <PerformancePage />
        </ChartCard>

        <ChartCard>
          <PearsonPage />
        </ChartCard>
      </GridBox>
    </Container>
  );
}
