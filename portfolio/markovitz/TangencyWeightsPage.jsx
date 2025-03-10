import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TangencyWeights from './table/TangencyWeights';
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

const TangencyWeightsPage = ({ data }) => {
  // Decode the data if it's a string, otherwise use it as is
  const decodedData = typeof data === 'string' ? JSON.parse(decodeURIComponent(data)) : data;

  if (!decodedData) {
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
          Otimização Tangencial
        </Typography>
        <TableContainer>
          <TangencyWeights weights={decodedData} />
        </TableContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TangencyWeightsPage;