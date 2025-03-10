import React from 'react';
import { Box, styled, useTheme, useMediaQuery } from "@mui/material";
import SunburstStocks from "./shared/SBPage";
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
  overflow: 'hidden',
  '& h3': {
    fontSize: '1.25rem',
    [theme.breakpoints.down("sm")]: {
      fontSize: '1rem',
      marginBottom: theme.spacing(1)
    }
  }
}));

const SunburstContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  },
  gap: theme.spacing(2),
  height: '100%',
}));

const SunburstItem = styled(Box)(({ theme }) => ({
  flex: 1,
  minHeight: '350px',
  [theme.breakpoints.down('md')]: {
    minHeight: '350px',
  },
}));

const ChartTitle = styled('h2')(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontSize: '1.25rem',
  [theme.breakpoints.down("sm")]: {
    fontSize: '1rem',
    marginBottom: theme.spacing(1)
  }
}));

export default function AppZboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container>
      <GridBox>
        <ChartCard>
          <SunburstContainer>
            <SunburstItem>
              <SunburstStocks />
            </SunburstItem>
            <SunburstItem>
              <ChartTitle>Recomendações IBOVESPA</ChartTitle>
              <IBOVPieChart 
                height={isMobile ? "220px" : "270px"}
                color={["#28a745", "#007bff", "#ffc107", "#dc3545"]}
              />
            </SunburstItem>
          </SunburstContainer>
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