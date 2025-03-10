// SurvivalPage.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import SurvivalChart from './SurvivalChart';
import SurvivalTable from './SurvivalTable';

const ContentBox = styled(Box)(({ theme }) => ({
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

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '70vh',
  minHeight: '400px',
  [theme.breakpoints.down('md')]: {
    height: '50vh',
  },
}));

const SurvivalPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Stock Survival Analysis</Title>
          <SubTitle>
            Analysis of significant drops in stock prices
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Survival Analysis Table
              </Typography>
              <SurvivalTable />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sobre esta Análise
              </Typography>
              <Typography variant="body1" component="div">
                <p>Esta página apresenta uma análise de sobrevivência de quedas significativas nos preços das ações de vários tickers. A análise é baseada em dados históricos e utiliza métodos estatísticos para estimar a probabilidade de uma ação sofrer uma queda significativa no preço.</p>
                <p><strong>Tabela de Sobrevivência:</strong> A tabela mostra métricas chave para cada ação:</p>
                <ul>
                  <li><strong>Dias Desde o Último Incidente:</strong> O número de dias desde a última queda significativa no preço.</li>
                  <li><strong>Probabilidade de Sobrevivência Atual:</strong> A probabilidade estimada de que a ação não sofra uma queda significativa em um futuro próximo.</li>
                  <li><strong>Taxa de Risco Atual:</strong> A taxa de risco estimada atual de que a ação possa sofrer uma queda significativa.</li>
                  <li><strong>Risco Acumulado Atual:</strong> O risco acumulado de sofrer uma queda significativa ao longo do tempo.</li>
                </ul>
                <p><strong>Gráfico de Sobrevivência:</strong> O gráfico para a ação PETR4 mostra a probabilidade de sobrevivência ao longo do tempo ou a taxa de risco, dependendo da visualização selecionada. Esta representação visual ajuda a entender o perfil de risco da ação ao longo do tempo.</p>
              </Typography>
            </CardContent>

          </StyledCard>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default SurvivalPage;