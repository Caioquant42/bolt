import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box, Container } from '@mui/material';
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
  textAlign: 'center',
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  marginBottom: '16px',
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

const FullWidthCard = styled(Card)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const CenteredCardContent = styled(CardContent)({
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '24px',
});

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const VolSurfacePage = () => {
  return (
    <ContentBox>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Title>Superfície de Volatilidade</Title>
            <SubTitle>
              Análise tridimensional da volatilidade implícita de opções
            </SubTitle>
          </Grid>
          
          <Grid item xs={12}>
            <FullWidthCard>
              <CenteredCardContent>
                <VolSurface height={8} width={2} />
              </CenteredCardContent>
            </FullWidthCard>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <InfoCard>
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
            </InfoCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoCard>
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
            </InfoCard>
          </Grid>
        </Grid>
      </Container>
    </ContentBox>
  );
};

export default VolSurfacePage;