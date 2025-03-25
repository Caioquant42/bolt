import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Pearson from './echarts/Pearson'; // Adjust the import path as necessary

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

const PearsonPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Correlação de Pearson do IBOV</Title>
          <SubTitle>
            Análise da correlação entre IBOV e outros ativos financeiros
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Pearson height="400px" color={['#1976d2', '#d32f2f', '#ffa000', '#7b1fa2']} />
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
                Este gráfico mostra a correlação de Pearson entre o IBOV e outros ativos financeiros ao longo do tempo.
                Uma correlação de 1 indica uma relação positiva perfeita, -1 indica uma relação negativa perfeita, e 0 indica ausência de correlação linear.
                Valores próximos a 1 ou -1 sugerem forte correlação, enquanto valores próximos a 0 sugerem fraca correlação.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Implicações para Investidores
              </Typography>
              <Typography variant="body1">
                Compreender as correlações entre ativos é crucial para a diversificação de portfólio.
                Ativos altamente correlacionados tendem a se mover juntos, enquanto ativos com baixa correlação ou correlação negativa podem ajudar a reduzir o risco geral do portfólio.
                Investidores podem usar essas informações para ajustar suas estratégias de alocação de ativos e gerenciamento de risco.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default PearsonPage;