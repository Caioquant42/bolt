import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography } from '@mui/material';
import PerformanceAssets from './echarts/PerformanceAssets';

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

const ChartContainer = styled('div')({
  flexGrow: 1,
  minHeight: '200px',
  maxHeight: '400px',
});

const PerformanceAssetsPage = ({ data }) => {
  const cumulativeReturns = data?.cumulative_returns || {};
  const dataLength = Object.keys(cumulativeReturns).length;
  const dynamicHeight = `${Math.max(200, Math.min(50 * dataLength, 400))}px`;

  return (
    <StyledCard>
      <StyledCardContent>
        <ChartContainer style={{ height: dynamicHeight }}>
          {Object.keys(cumulativeReturns).length > 0 ? (
            <PerformanceAssets data={cumulativeReturns} height="100%" width="100%" />
          ) : (
            <Typography>No data available</Typography>
          )}
        </ChartContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

export default PerformanceAssetsPage;