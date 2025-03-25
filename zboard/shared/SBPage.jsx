import React from 'react';
import { Card, CardContent, CardHeader, Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import SunburstStocks from './echarts/SunburstStocks';
import { styled } from '@mui/material/styles';

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '500',
  marginBottom: theme.spacing(2),
  color: theme.palette.primary.main,
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
    marginBottom: theme.spacing(1),
  },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  [theme.breakpoints.down('sm')]: {
    fontSize: '0.875rem',
    marginBottom: theme.spacing(1),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  overflow: 'hidden',
  [theme.breakpoints.down('sm')]: {
    margin: 0,
    borderRadius: 0
  }
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '600px',
  [theme.breakpoints.down('md')]: {
    height: '500px'
  },
  [theme.breakpoints.down('sm')]: {
    height: '400px'
  }
}));

const SBPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <StyledCard>
      <CardContent>
        <Title>Visão Setorial do Mercado</Title>
        <SubTitle>
          Análise da distribuição e variação dos ativos por setor no mercado brasileiro
        </SubTitle>
        <ChartContainer>
          <SunburstStocks />
        </ChartContainer>
      </CardContent>
    </StyledCard>
  );
};

export default SBPage;
