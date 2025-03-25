import React from 'react';
import { Box, Grid, styled } from "@mui/material";
import NYSEStrongBuyTable from "./NYSEStrongBuyTable";
import NYSEBuyTable from "./NYSEBuyTable";
import NYSEAllTable from "./NYSEAllTable";
import NYSEPieChart from "./NYSEPieChart"; // Import the new component
import { SimpleCard } from "app/components";

// STYLED COMPONENTS
const Container = styled(Box)(({ theme }) => ({
  margin: "20px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const StyledCard = styled(SimpleCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

export default function AppNYSE() {
  return (
    <Container>
      <Grid container spacing={3}>

        <Grid item xs={12} md={12} lg={12}>
          <StyledCard title="Recomendações NYSE">
            <NYSEPieChart 
              height="500px" 
              color={["#28a745", "#007bff", "#ffc107", "#dc3545"]}
            />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <StyledCard title="Compra Forte">
            <NYSEStrongBuyTable />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <StyledCard title="Compra">
            <NYSEBuyTable />
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard title="Todas Recomendações">
            <NYSEAllTable />
          </StyledCard>
        </Grid>
      </Grid>
    </Container>

  );
}