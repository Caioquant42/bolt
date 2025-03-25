import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import ScatterChart from './echarts/ScatterChart';

const ContentBox = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '500',
  marginBottom: '20px',
  color: theme.palette.primary.main,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  marginBottom: '16px',
  color: theme.palette.text.secondary,
}));

const ScatterPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Análise de Volatilidade</Title>
          <SubTitle>
            Distribuição da volatilidade dos ativos do mercado
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <ScatterChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default ScatterPage;
