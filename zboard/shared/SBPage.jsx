import React from 'react';
import { Card, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import SunburstStocks from './echarts/SunburstStocks';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    margin: 0,
    borderRadius: 0
  }
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: '1.25rem',
  fontWeight: 500,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1),
    fontSize: '1rem'
  }
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '600px',
  [theme.breakpoints.down('sm')]: {
    height: '400px'
  },
  [theme.breakpoints.down('xs')]: {
    height: '350px'
  }
}));

const SBPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledCard>
      <ChartTitle variant="h3">
        Visão de Mercado
      </ChartTitle>
      <ChartContainer>
        <SunburstStocks />
      </ChartContainer>
    </StyledCard>
  );
};

export default SBPage;
