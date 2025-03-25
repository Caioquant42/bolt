import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import FluxoEstrangeiro from './echarts/FluxoEstrangeiro';
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

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '400px',
  [theme.breakpoints.up('md')]: {
    minHeight: '450px',
  },
  [theme.breakpoints.up('lg')]: {
    minHeight: '500px',
  },
}));

const FluxoEstrangeiroPage = () => {
  return (
    <Card elevation={3}>
      <CardContent>
        <Title>Fluxo de Capital Estrangeiro</Title>
        <SubTitle>
          Análise do movimento de capital estrangeiro no mercado brasileiro
        </SubTitle>
        <ChartContainer>
          <FluxoEstrangeiro />
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default FluxoEstrangeiroPage;
