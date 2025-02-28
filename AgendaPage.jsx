// AgendaPage.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import AgendaTable from './AgendaTable';

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

const AgendaPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Title>Agenda de Dividendos</Title>
          <SubTitle>
            Próximas datas para pagamento de proventos
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tabela de Agenda de Dividendos
              </Typography>
              <AgendaTable />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sobre Esta Agenda
              </Typography>
              <Typography variant="body1" component="div">
                <p>Esta página apresenta uma agenda de dividendos para várias ações. A agenda fornece informações sobre os próximos pagamentos de dividendos, incluindo datas importantes e detalhes de pagamento.</p>
                <p><strong>Tabela de Agenda de Dividendos:</strong> A tabela mostra informações chave para cada pagamento de dividendo:</p>
                <ul>
                  <li><strong>Código:</strong> O código da ação ou símbolo do ticker.</li>
                  <li><strong>Tipo:</strong> O tipo de pagamento (por exemplo, JCP para Juros sobre Capital Próprio).</li>
                  <li><strong>Valor (R$):</strong> O valor do pagamento do dividendo em Reais.</li>
                  <li><strong>Registro:</strong> A data de registro, que determina quem é elegível para receber o dividendo.</li>
                  <li><strong>Ex:</strong> A data ex-dividendo, após a qual novos compradores da ação não receberão o próximo dividendo.</li>
                  <li><strong>Pagamento:</strong> A data de pagamento quando o dividendo será distribuído aos acionistas.</li>
                </ul>
                <p>Estas informações são cruciais para os investidores planejarem suas estratégias de investimento e entenderem o fluxo de caixa de suas participações em ações. Lembre-se de que as políticas de dividendos podem mudar e que dividendos passados não garantem pagamentos futuros.</p>
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default AgendaPage;