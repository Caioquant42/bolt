import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import CurvaJuros from './echarts/CurvaJuros'; // Adjust the import path as necessary

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

const CurvaJurosPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Curva de Juros</Title>
          <SubTitle>
            Análise da estrutura a termo das taxas de juros do mercado brasileiro
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CurvaJuros height="400px" color={['#8884d8']} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Interpretação da Curva
              </Typography>
              <Typography variant="body1">
                A curva de juros mostra as taxas de juros para diferentes prazos de vencimento. 
                Uma curva ascendente geralmente indica expectativas de crescimento econômico e inflação, 
                enquanto uma curva descendente pode sinalizar preocupações econômicas.
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
                As taxas de juros são influenciadas por diversos fatores, incluindo política monetária, 
                expectativas de inflação, crescimento econômico e condições de mercado globais.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default CurvaJurosPage;