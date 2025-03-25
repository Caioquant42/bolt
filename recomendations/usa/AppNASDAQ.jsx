import React from 'react';
import { Box, Grid, styled } from "@mui/material";
import NASDAQStrongBuyTable from "./NASDAQStrongBuyTable";
import NASDAQBuyTable from "./NASDAQBuyTable";
import NASDAQAllTable from "./NASDAQAllTable";
import NASDAQPieChart from "./NASDAQPieChart"; // Import the new component
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

export default function AppNASDAQ() {
  return (
    <Container>
      <Grid container spacing={3}>

        <Grid item xs={12} >
          <StyledCard title="Recomendações NASDAQ">
            <NASDAQPieChart 
              height="500px" 
              color={["#28a745", "#007bff", "#ffc107", "#dc3545"]}
            />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <StyledCard title="Compra Forte">
            <NASDAQStrongBuyTable />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <StyledCard title="Compra">
            <NASDAQBuyTable />
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard title="Todas Recomendações">
            <NASDAQAllTable />
          </StyledCard>
        </Grid>
      </Grid>
    </Container>

  );
}