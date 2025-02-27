import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { fetchSurfaceView } from '/src/__api__/db/apiService';
import { Box, Autocomplete, TextField, CircularProgress, Typography } from '@mui/material';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Plot error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <Typography color="error">Something went wrong with the plot.</Typography>;
    }
    return this.props.children;
  }
}

const VolSurface = ({ height, width, initialTicker = 'PETR4' }) => {
  const [data, setData] = useState({ x: [], y: [], z: [] });
  const [ticker, setTicker] = useState(initialTicker);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVolatilityData = async (ticker) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSurfaceView(ticker);
      console.log('API Response:', response);
      if (response && Array.isArray(response)) {
        const normalData = removeOutliers(response);
        console.log('Normal Data:', normalData);
        const { x, y, z } = processVolatilityData(normalData);
        console.log('Processed Data:', { x, y, z });
        setData({ x, y, z });
      } else {
        setError(`No data found for ticker ${ticker}`);
      }
    } catch (error) {
      console.error('Error fetching volatility data:', error);
      setError('Error fetching volatility data');
    }
    setLoading(false);
  };

  const removeOutliers = (data) => {
    const volatilities = data.map(option => option.volatility);
    const Q1 = quantile(volatilities, 0.25);
    const Q3 = quantile(volatilities, 0.75);
    const IQR = Q3 - Q1;
    const lowerBound = Q1 - 1.5 * IQR;
    const upperBound = Q3 + 1.5 * IQR;
    return data.filter(option => option.volatility >= lowerBound && option.volatility <= upperBound);
  };

  const quantile = (array, q) => {
    const sorted = array.slice().sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sorted[base + 1] !== undefined) {
      return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
    }
    return sorted[base];
  };


  const processVolatilityData = (data) => {
    console.log('Total data points:', data.length);
    const x = [...new Set(data.map(option => option.strike))].sort((a, b) => a - b);
    const y = [...new Set(data.map(option => option.days_to_maturity))].sort((a, b) => a - b);
    
    const z = y.map(() => new Array(x.length).fill(null));

    data.forEach(option => {
      const xIndex = x.indexOf(option.strike);
      const yIndex = y.indexOf(option.days_to_maturity);
      if (xIndex !== -1 && yIndex !== -1) {
        z[yIndex][xIndex] = option.volatility;
      }
    });

    console.log('Processed data points:', x.length * y.length);
    return { x, y, z };
  };

  useEffect(() => {
    console.log('Fetching data for ticker:', ticker);
    fetchVolatilityData(ticker);
  }, [ticker]);

  const layout = {
    title: `${ticker} Volatility Surface`,
    autosize: false,
    width: width || 700,
    height: height || 700,
    scene: {
      xaxis: { title: 'Strike' },
      yaxis: { title: 'Days to Maturity' },
      zaxis: { title: 'Implied Volatility (Annualized)' }
    },
    margin: {
      l: 65,
      r: 50,
      b: 65,
      t: 90,
    }
  };

  console.log('Rendering VolSurface with data:', data);

  return (
    <Box my={4}>
      <Autocomplete
        options={['PETR4', 'VALE3', 'ITUB4']}
        value={ticker}
        onChange={(event, newValue) => setTicker(newValue ? newValue.toUpperCase() : '')}
        renderInput={(params) => <TextField {...params} label="Ticker" variant="outlined" />}
        sx={{ mb: 4 }}
      />
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : data.x.length > 0 && data.y.length > 0 && data.z.length > 0 ? (
        <ErrorBoundary>
          <Plot
            data={[{
              x: data.x,
              y: data.y,
              z: data.z,
              type: 'surface',
              colorscale: 'Viridis',
              colorbar: {
                title: 'Implied Volatility',
                titleside: 'right'
              }
            }]}
            layout={layout}
          />
        </ErrorBoundary>
      ) : (
        <Typography>No data available for the selected ticker.</Typography>
      )}
    </Box>
  );
};

export default VolSurface;
