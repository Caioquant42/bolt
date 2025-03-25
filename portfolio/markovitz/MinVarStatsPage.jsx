import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import MinVarStats from './table/MinVarStats';
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

const MinVarStatsPage = ({ data }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
          Estatísticas Min. Variância
        </Typography>
        <TableContainer>
          {data ? (
            <MinVarStats data={data} />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <Typography>Carregando estatísticas... (Dados não disponíveis)</Typography>
            </Box>
          )}
        </TableContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

export default MinVarStatsPage;