import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Performance from './echarts/Performance'; // Adjust the import path as necessary

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

const PerformancePage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Performance Relativa dos Ativos</Title>
          <SubTitle>
            Comparação da performance entre IBOV, CDI, Dólar, Ouro e S&P 500
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Performance height="500px" color={['#1976d2', '#388e3c', '#d32f2f', '#ffa000', '#7b1fa2']} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interpretação do Gráfico
              </Typography>
              <Typography variant="body1">
                Este gráfico mostra a performance relativa dos principais ativos financeiros ao longo do tempo.
                Uma linha ascendente indica valorização do ativo, enquanto uma linha descendente indica desvalorização.
                A comparação permite visualizar qual ativo teve melhor desempenho no período analisado.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Fatores de Influência
              </Typography>
              <Typography variant="body1">
                A performance dos ativos é influenciada por diversos fatores, incluindo:
                condições econômicas globais e locais, políticas monetárias, eventos geopolíticos,
                desempenho de setores específicos e sentimento do mercado. É importante considerar
                esses fatores ao analisar as tendências de performance.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default PerformancePage;