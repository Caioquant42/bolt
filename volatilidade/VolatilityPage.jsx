// VolatilityPage.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import VolatilityTable from './VolatilityTable';

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

const VolatilityPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Análise de Volatilidade de Ações</Title>
          <SubTitle>
            Análise abrangente de métricas de volatilidade para várias ações
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tabela de Análise de Volatilidade
              </Typography>
              <VolatilityTable />
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
                <p>Esta página apresenta uma análise abrangente da volatilidade das ações. A tabela abaixo mostra várias métricas de volatilidade, incluindo:</p>
                <ul>
                  <li><strong>EWMA (Média Móvel Exponencialmente Ponderada):</strong> Uma medida de volatilidade que dá mais peso a observações recentes.</li>
                  <li><strong>IV (Volatilidade Implícita):</strong> A volatilidade esperada do mercado derivada dos preços das opções.</li>
                  <li><strong>Razão IV/EWMA:</strong> Comparação entre a volatilidade implícita e a volatilidade histórica.</li>
                  <li><strong>Percentis e Rankings:</strong> Posição relativa das métricas de volatilidade.</li>
                  <li><strong>GARCH(1,1):</strong> Um modelo estatístico para prever a volatilidade.</li>
                  <li><strong>Beta IBOV:</strong> Medida de volatilidade relativa ao índice Ibovespa.</li>
                  <li><strong>Correlação IBOV:</strong> Grau de movimento conjunto com o índice Ibovespa.</li>
                  <li><strong>Entropia:</strong> Uma medida da aleatoriedade ou imprevisibilidade dos retornos das ações.</li>
                </ul>
                <p>Use o seletor de período para visualizar dados para diferentes intervalos de tempo: Atual, 6 Meses ou 1 Ano.</p>
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default VolatilityPage;