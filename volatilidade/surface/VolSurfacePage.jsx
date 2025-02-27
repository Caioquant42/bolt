import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import VolSurface from './plotly/VolSurface'; // Adjust the import path as necessary

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

const VolSurfacePage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Superfície de Volatilidade PETR4</Title>
          <SubTitle>
            Análise tridimensional da volatilidade implícita de opções da PETR4
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <VolSurface height={600} width={800} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interpretação da Superfície de Volatilidade
              </Typography>
              <Typography variant="body1">
                A superfície de volatilidade mostra como a volatilidade implícita das opções varia em relação ao preço de exercício e ao tempo até o vencimento.
                Cores mais quentes (vermelho/amarelo) indicam maior volatilidade, enquanto cores mais frias (azul/verde) indicam menor volatilidade.
                Padrões na superfície podem revelar expectativas do mercado sobre movimentos futuros do preço da ação.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Implicações para Traders
              </Typography>
              <Typography variant="body1">
                Traders podem usar a superfície de volatilidade para identificar oportunidades de arbitragem, ajustar estratégias de hedging e precificar opções exóticas.
                Mudanças na forma da superfície ao longo do tempo podem indicar alterações nas expectativas do mercado ou na percepção de risco.
                É uma ferramenta valiosa para a gestão de risco e a tomada de decisões em estratégias envolvendo opções.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default VolSurfacePage;