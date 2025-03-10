import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box, Paper } from '@mui/material';
import RRGChart from './RRGChart';

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
  boxShadow: theme.shadows[3],
}));

const RRGPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Relative Rotation Graph (RRG)</Title>
          <SubTitle>
            Análise de força relativa e momentum de ativos em relação ao benchmark
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '1100px', padding: '16px' }}>
              <RRGChart />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interpretação do RRG
              </Typography>
              <Typography variant="body1" component="div">
                O Relative Rotation Graph (RRG) é dividido em quatro quadrantes:
                <ul>
                  <li><strong>Liderando (superior direito):</strong> Alta força relativa e alto momentum.</li>
                  <li><strong>Enfraquecendo (inferior direito):</strong> Alta força relativa, mas momentum decrescente.</li>
                  <li><strong>Atrasado (inferior esquerdo):</strong> Baixa força relativa e baixo momentum.</li>
                  <li><strong>Melhorando (superior esquerdo):</strong> Baixa força relativa, mas momentum crescente.</li>
                </ul>
                Os ativos tendem a se mover no sentido horário através destes quadrantes ao longo do tempo.
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aplicações para Investidores
              </Typography>
              <Typography variant="body1" component="div">
                O RRG pode ser usado para:
                <ul>
                  <li>Identificar tendências emergentes em diferentes setores ou ativos.</li>
                  <li>Comparar o desempenho relativo de múltiplos ativos simultaneamente.</li>
                  <li>Auxiliar na rotação setorial e na seleção de ativos para portfólios.</li>
                  <li>Monitorar mudanças na liderança de mercado entre diferentes grupos de ativos.</li>
                </ul>
                É uma ferramenta valiosa para análise técnica e alocação tática de ativos.
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Nota: O RRG mostra a evolução dos ativos nos últimos dias. A posição atual é indicada pela seta, e o caminho mostra a trajetória recente.
              Valores acima de 100 indicam desempenho superior ao benchmark, enquanto valores abaixo de 100 indicam desempenho inferior.
              Use o seletor de ativos acima do gráfico para personalizar a visualização.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default RRGPage;