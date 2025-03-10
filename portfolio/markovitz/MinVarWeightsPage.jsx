import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import MinVarWeights from './table/MinVarWeights';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
});

const TableContainer = styled(Box)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
  overflowY: 'auto',
});

const MinVarWeightsPage = ({ data }) => {
  if (!data) {
    return (
      <StyledCard>
        <StyledCardContent>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography>Carregando dados... (Dados não disponíveis)</Typography>
          </Box>
        </StyledCardContent>
      </StyledCard>
    );
  }

  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
          Otimização Variância Mínima
        </Typography>
        <TableContainer>
          <MinVarWeights data={data} />
        </TableContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

export default MinVarWeightsPage;