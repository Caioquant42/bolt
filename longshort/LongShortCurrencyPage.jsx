// LongShortCurrencyPage.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import LongShortCurrencyTable from './LongShortCurrencyTable';

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

const LongShortCurrencyPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Análise de Cointegração</Title>
          <SubTitle>
            Pares de ativos cointegrados para estratégias Long-Short
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pares Cointegrados
              </Typography>
              <LongShortCurrencyTable  />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sobre Cointegração
              </Typography>
              <Typography variant="body1" component="div">
                <p>A cointegração é uma propriedade estatística de séries temporais que indica uma relação de equilíbrio de longo prazo entre duas ou mais séries. Quando dois ativos são cointegrados, eles tendem a mover-se juntos ao longo do tempo, mesmo que possam divergir temporariamente.</p>
                <p><strong>Estratégia Long-Short:</strong> Quando dois ativos são cointegrados, é possível implementar uma estratégia de arbitragem estatística:</p>
                <ul>
                  <li><strong>Comprar (long):</strong> O ativo que está temporariamente subvalorizado em relação ao outro.</li>
                  <li><strong>Vender (short):</strong> O ativo que está temporariamente sobrevalorizado em relação ao outro.</li>
                </ul>
                <p><strong>p-value:</strong> O valor-p indica a significância estatística da cointegração. Quanto menor o valor-p, mais forte é a evidência de cointegração entre os ativos.</p>
                <p>Esta análise é atualizada regularmente e pode ser usada como parte de uma estratégia de investimento quantitativa. Lembre-se que relações de cointegração podem mudar ao longo do tempo e que o desempenho passado não garante resultados futuros.</p>
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default LongShortCurrencyPage;