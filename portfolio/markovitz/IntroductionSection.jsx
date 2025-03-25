// ./IntroductionSection.jsx

import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

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

const IntroductionSection = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Otimização de Portfólio</Title>
          <SubTitle>
            Ferramenta avançada para criar um portfólio de investimentos otimizado
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sobre esta Ferramenta
              </Typography>
              <Typography variant="body1" component="div">
                <p>Bem-vindo à nossa ferramenta de Otimização de Portfólio. Esta aplicação utiliza técnicas avançadas de análise financeira para ajudar você a criar um portfólio de investimentos otimizado.</p>
                <p>Com base na Teoria Moderna do Portfólio, nossa ferramenta calcula a alocação ideal de ativos para maximizar o retorno esperado para um dado nível de risco, ou minimizar o risco para um determinado nível de retorno.</p>
                <p><strong>Como usar:</strong></p>
                <ol>
                  <li>Selecione os ativos que deseja incluir no seu portfólio.</li>
                  <li>Escolha o período de análise (6, 12, 24 ou 36 meses).</li>
                  <li>Clique em "Gerar Relatório" para ver os resultados da otimização.</li>
                </ol>
                <p><strong>Resultados da Otimização:</strong></p>
                <ul>
                  <li><strong>Pesos dos Ativos:</strong> A alocação ideal para cada ativo no portfólio.</li>
                  <li><strong>Performance dos Ativos:</strong> Gráfico mostrando o desempenho histórico dos ativos selecionados.</li>
                  <li><strong>Comparação com Benchmark:</strong> Comparação do desempenho do portfólio otimizado com um benchmark (como o IBOVESPA).</li>
                  <li><strong>Estatísticas do Portfólio:</strong> Métricas importantes como retorno esperado, volatilidade, Sharpe ratio, entre outras.</li>
                </ul>
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default IntroductionSection;