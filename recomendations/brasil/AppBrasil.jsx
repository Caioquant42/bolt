import React from 'react';
import { Box, Grid, styled } from "@mui/material";
import StrongBuyTable from "./StrongBuyTable";
import BuyTable from "./BuyTable";
import AllTable from "./AllTable";
import PieChart from "./PieChart";
import IBOVPieChart from "./IBOVPieChart";
import { SimpleCard } from "app/components";

const Container = styled(Box)(({ theme }) => ({
  margin: "20px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const StyledCard = styled(SimpleCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const TableWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
});

export default function AppBrasil() {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={6}>
          <StyledCard title="Recomendações Ativos Listados">
            <PieChart 
              height="400px" 
              color={["#28a745", "#007bff", "#ffc107", "#dc3545"]}
            />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <StyledCard title="Recomendações IBOV">
            <IBOVPieChart 
              height="400px" 
              color={["#28a745", "#007bff", "#ffc107", "#dc3545"]}
            />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <StyledCard title="Compra Forte">
            <TableWrapper>
              <StrongBuyTable />
            </TableWrapper>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <StyledCard title="Compra">
            <BuyTable />
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard title="Todas Recomendações">
            <AllTable />
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
}