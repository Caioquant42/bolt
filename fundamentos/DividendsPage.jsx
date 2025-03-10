import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import HistoricalDY from "./HistoricalDY"; // Adjust the import path as necessary

const DividendsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Análise Dividend Yield
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Comparação Histórica de Rendimento de Dividendos
          </Typography>
          <Typography variant="body1" paragraph>
            Compare os rendimentos históricos dos dividendos de várias ações ao longo do tempo. Selecione uma ou mais ações para visualizar o desempenho dos seus dividendos.
          </Typography>
          <HistoricalDY />
        </Paper>        
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Insights sobre Dividendos
          </Typography>
          <Typography variant="body1" paragraph>
            Analisar o histórico de dividendos pode fornecer insights valiosos sobre a saúde financeira de uma empresa e a criação de valor para os acionistas. Aqui estão alguns pontos-chave a considerar:
          </Typography>
          <ul>
            <li>Consistência: Procure por ações com um histórico de pagamentos de dividendos estáveis ou crescentes.</li>
            <li>Rendimento: Rendimentos mais altos podem ser atraentes, mas certifique-se de que sejam sustentáveis.</li>
            <li>Índice de Payout: Um índice de payout mais baixo pode indicar mais espaço para o crescimento dos dividendos.</li>
            <li>Crescimento da Empresa: Considere o potencial de crescimento dos lucros futuros da empresa para sustentar os dividendos.</li>
          </ul>
          <Typography variant="body1">
            Use o gráfico acima para comparar os rendimentos dos dividendos entre diferentes ações e identificar tendências ao longo do tempo.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default DividendsPage;