// StatmentsPage.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import StatmentsTable from './StatmentsTable';

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

const StatmentsPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Demonstrativos Financeiros</Title>
          <SubTitle>
            Análise detalhada dos dados financeiros essenciais para avaliação de ações
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tabela de Demonstrativos
              </Typography>
              <StatmentsTable />
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
                <p>Esta página apresenta uma análise abrangente dos demonstrativos financeiros de várias empresas. A tabela acima mostra dados financeiros essenciais, incluindo:</p>
                <ul>
                  <li><strong>Indicadores:</strong> Métricas-chave de desempenho financeiro.</li>
                  <li><strong>Balanço Patrimonial:</strong> Visão geral dos ativos, passivos e patrimônio líquido da empresa.</li>
                  <li><strong>Resultados Anuais:</strong> Desempenho financeiro anual da empresa.</li>
                  <li><strong>Resultados Trimestrais:</strong> Desempenho financeiro trimestral da empresa.</li>
                  <li><strong>Fluxo de Caixa:</strong> Movimentação de caixa da empresa ao longo do tempo.</li>
                </ul>
                <p>Use o seletor de ações para escolher a empresa desejada e as abas para alternar entre diferentes tipos de demonstrativos financeiros.</p>
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default StatmentsPage;