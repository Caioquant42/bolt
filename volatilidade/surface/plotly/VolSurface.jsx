import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { fetchSurfaceView } from '/src/__api__/db/apiService';
import { Box, Autocomplete, TextField, CircularProgress, Typography, Slider, Grid, Paper, Switch, FormControlLabel } from '@mui/material';

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
      return <Typography color="error">Something went wrong with the plot. Please try refreshing the page.</Typography>;
    }
    return this.props.children;
  }
}

const VolSurface = ({ height, width, initialTicker = 'BBAS3' }) => {
  const [rawData, setRawData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [scatterData, setScatterData] = useState(null);
  const [ticker, setTicker] = useState(initialTicker);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTickers] = useState(['PETR4','VALE3', 'BOVA11', 'BBAS3', 'BBDC4', 'COGN3', 'MGLU3', 'ITUB4', 'WEGE3', 'EMBR3']);
  const [showDataPoints, setShowDataPoints] = useState(true);
  
  // Filter ranges
  const [strikeRange, setStrikeRange] = useState([0, 100]);
  const [maturityRange, setMaturityRange] = useState([0, 500]);
  const [volatilityRange, setVolatilityRange] = useState([0, 100]);
  
  // Range limits
  const [strikeLimits, setStrikeLimits] = useState([0, 100]);
  const [maturityLimits, setMaturityLimits] = useState([0, 500]);
  const [volatilityLimits, setVolatilityLimits] = useState([0, 100]);

  // Layout state
  const [layout, setLayout] = useState({
    title: `${ticker} Volatility Surface`,
    autosize: true,
    width: 1,
    height: 1,
    scene: {
      xaxis: { 
        title: {
          text: 'Preço de exercício',
          font: { size: 14 }
        },
        range: [0, 100],
        autorange: true
      },
      yaxis: { 
        title: {
          text: 'Dias até o vencimento',
          font: { size: 14 }
        },
        range: [0, 500],
        autorange: true
      },
      zaxis: { 
        title: {
          text: 'Volatilidade Implícita (%)',
          font: { size: 14 }
        },
        range: [0, 100],
        autorange: true
      },
      camera: {
        eye: { x: 1.5, y: 1.5, z: 1 }
      },
      aspectratio: { x: 1, y: 1, z: 0.7 }
    },
    margin: {
      l: 1,
      r: 1,
      b: 1,
      t: 1,
    }
  });

  const fetchVolatilityData = async (ticker) => {
    if (!ticker) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetchSurfaceView(ticker);
      console.log('API Response:', response);
      
      if (response && Array.isArray(response) && response.length > 0) {
        // Clean the data
        const cleanData = response.filter(item => 
          item && 
          typeof item.strike === 'number' && !isNaN(item.strike) &&
          typeof item.days_to_maturity === 'number' && !isNaN(item.days_to_maturity) &&
          typeof item.volatility === 'number' && !isNaN(item.volatility)
        );
        
        console.log('Clean data points:', cleanData.length);
        
        if (cleanData.length < 10) {
          setError(`Not enough valid data points for ticker ${ticker}`);
          setLoading(false);
          return;
        }
        
        // Remove outliers
        const normalData = removeOutliers(cleanData);
        console.log('Normal Data after outlier removal:', normalData.length);
        
        // Set range limits based on data
        const strikes = normalData.map(item => item.strike);
        const maturities = normalData.map(item => item.days_to_maturity);
        const volatilities = normalData.map(item => item.volatility);
        
        const newStrikeLimits = [Math.min(...strikes), Math.max(...strikes)];
        const newMaturityLimits = [Math.min(...maturities), Math.max(...maturities)];
        const newVolatilityLimits = [Math.min(...volatilities), Math.max(...volatilities)];
        
        setStrikeLimits(newStrikeLimits);
        setMaturityLimits(newMaturityLimits);
        setVolatilityLimits(newVolatilityLimits);
        
        // Set initial ranges to full data range
        setStrikeRange(newStrikeLimits);
        setMaturityRange(newMaturityLimits);
        setVolatilityRange(newVolatilityLimits);
        
        // Update layout with new ranges
        updateLayout(newStrikeLimits, newMaturityLimits, newVolatilityLimits);
        
        // Create the surface data
        const surfaceData = createSurfaceData(normalData);
        console.log('Surface data created');
        
        // Create scatter data for actual data points
        const scatter = createScatterData(normalData);
        
        setRawData(normalData);
        setFilteredData(surfaceData);
        setScatterData(scatter);
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
    // Calculate volatility statistics
    const volatilities = data.map(option => option.volatility);
    const mean = volatilities.reduce((sum, val) => sum + val, 0) / volatilities.length;
    const stdDev = Math.sqrt(
      volatilities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / volatilities.length
    );
    
    // Filter out points that are more than 3 standard deviations from the mean
    const threshold = 3 * stdDev;
    return data.filter(option => 
      Math.abs(option.volatility - mean) <= threshold
    );
  };

  const createScatterData = (data) => {
    // Apply filters
    const filteredPoints = data.filter(item => 
      item.strike >= strikeRange[0] && item.strike <= strikeRange[1] &&
      item.days_to_maturity >= maturityRange[0] && item.days_to_maturity <= maturityRange[1] &&
      item.volatility >= volatilityRange[0] && item.volatility <= volatilityRange[1]
    );
    
    return {
      x: filteredPoints.map(item => item.strike),
      y: filteredPoints.map(item => item.days_to_maturity),
      z: filteredPoints.map(item => item.volatility),
      text: filteredPoints.map(item => 
        `<b>${item.symbol || ticker}</b><br>` +
        `Preço de exercício: ${item.strike.toFixed(2)}<br>` +
        `Dias até o vencimento: ${item.days_to_maturity}<br>` +
        `Volatilidade Implícita: ${item.volatility.toFixed(2)}%` +
        (item.moneyness ? `<br>Moneyness: ${item.moneyness}` : '') +
        (item.option_type ? `<br>Tipo: ${item.option_type}` : '')
      ),
      customdata: filteredPoints.map(item => item.symbol || null)
    };
  };

  const createSurfaceData = (data) => {
    // Aplicar filtros
    const filteredData = data.filter(item => 
      item.strike >= strikeRange[0] && item.strike <= strikeRange[1] &&
      item.days_to_maturity >= maturityRange[0] && item.days_to_maturity <= maturityRange[1] &&
      item.volatility >= volatilityRange[0] && item.volatility <= volatilityRange[1]
    );
    
    // Criar uma grade para interpolação
    const uniqueStrikes = [...new Set(filteredData.map(item => item.strike))].sort((a, b) => a - b);
    const uniqueMaturities = [...new Set(filteredData.map(item => item.days_to_maturity))].sort((a, b) => a - b);
    
    // Adicionar pontos intermediários para uma superfície mais suave
    const interpolatedStrikes = interpolateArray(uniqueStrikes, 2);
    const interpolatedMaturities = interpolateArray(uniqueMaturities, 2);
    
    // Criar uma grade 2D para a superfície
    const xGrid = [];
    const yGrid = [];
    const zGrid = [];
    
    for (let i = 0; i < interpolatedMaturities.length; i++) {
      const maturity = interpolatedMaturities[i];
      const xRow = [];
      const yRow = [];
      const zRow = [];
      
      for (let j = 0; j < interpolatedStrikes.length; j++) {
        const strike = interpolatedStrikes[j];
        xRow.push(strike);
        yRow.push(maturity);
        
        // Encontrar os pontos mais próximos para interpolação
        const volatility = interpolateVolatility(filteredData, strike, maturity);
        zRow.push(volatility);
      }
      
      xGrid.push(xRow);
      yGrid.push(yRow);
      zGrid.push(zRow);
    }
    
    return {
      x: xGrid,
      y: yGrid,
      z: zGrid
    };
  };
  
  // Helper function to interpolate arrays
  const interpolateArray = (arr, factor) => {
    if (arr.length < 2) return arr;
    
    const result = [];
    for (let i = 0; i < arr.length - 1; i++) {
      const start = arr[i];
      const end = arr[i + 1];
      const step = (end - start) / (factor + 1);
      
      result.push(start);
      for (let j = 1; j <= factor; j++) {
        result.push(start + j * step);
      }
    }
    result.push(arr[arr.length - 1]);
    
    return result;
  };
  
  // Helper function to interpolate volatility
  const interpolateVolatility = (data, strike, maturity) => {
    // Find the 4 closest points
    const points = data.map(item => ({
      strike: item.strike,
      maturity: item.days_to_maturity,
      volatility: item.volatility,
      distance: Math.sqrt(
        Math.pow(item.strike - strike, 2) + 
        Math.pow(item.days_to_maturity - maturity, 2)
      )
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4);
    
    if (points.length === 0) return null;
    
    // If we have an exact match, return it
    if (points[0].distance === 0) return points[0].volatility;
    
    // Otherwise, use inverse distance weighting
    let weightedSum = 0;
    let weightSum = 0;
    
    for (const point of points) {
      if (point.distance === 0) {
        return point.volatility; // Exact match
      }
      
      const weight = 1 / Math.pow(point.distance, 2);
      weightedSum += point.volatility * weight;
      weightSum += weight;
    }
    
    return weightedSum / weightSum;
  };

  // Update layout with new ranges
  const updateLayout = (strikeRange, maturityRange, volatilityRange) => {
    setLayout(prevLayout => ({
      ...prevLayout,
      title: `${ticker} - Superfície de Volatilidade`,
      scene: {
        ...prevLayout.scene,
        xaxis: {
          ...prevLayout.scene.xaxis,
          range: strikeRange,
          autorange: false
        },
        yaxis: {
          ...prevLayout.scene.yaxis,
          range: maturityRange,
          autorange: false
        },
        zaxis: {
          ...prevLayout.scene.zaxis,
          range: volatilityRange,
          autorange: false
        }
      }
    }));
  };

  // Update filtered data when filters change
  useEffect(() => {
    if (rawData) {
      // Update layout with new ranges
      updateLayout(strikeRange, maturityRange, volatilityRange);
      
      // Update filtered data
      const newFilteredData = createSurfaceData(rawData);
      const newScatterData = createScatterData(rawData);
      setFilteredData(newFilteredData);
      setScatterData(newScatterData);
    }
  }, [strikeRange, maturityRange, volatilityRange, rawData]);

  useEffect(() => {
    console.log('Fetching data for ticker:', ticker);
    if (ticker) {
      fetchVolatilityData(ticker);
    }
  }, [ticker]);

  const formatValue = (value) => {
    return value.toFixed(2);
  };

  return (
    <Box my={4}>
      <Autocomplete
        options={availableTickers}
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
      ) : filteredData ? (
        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Preço de Exercício: {formatValue(strikeRange[0])} - {formatValue(strikeRange[1])}
                </Typography>
                <Slider
                  value={strikeRange}
                  onChange={(e, newValue) => setStrikeRange(newValue)}
                  valueLabelDisplay="auto"
                  min={strikeLimits[0]}
                  max={strikeLimits[1]}
                  step={(strikeLimits[1] - strikeLimits[0]) / 100}
                  valueLabelFormat={formatValue}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Dias até o Vencimento: {formatValue(maturityRange[0])} - {formatValue(maturityRange[1])}
                </Typography>
                <Slider
                  value={maturityRange}
                  onChange={(e, newValue) => setMaturityRange(newValue)}
                  valueLabelDisplay="auto"
                  min={maturityLimits[0]}
                  max={maturityLimits[1]}
                  step={(maturityLimits[1] - maturityLimits[0]) / 100}
                  valueLabelFormat={formatValue}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Volatilidade (%): {formatValue(volatilityRange[0])} - {formatValue(volatilityRange[1])}
                </Typography>
                <Slider
                  value={volatilityRange}
                  onChange={(e, newValue) => setVolatilityRange(newValue)}
                  valueLabelDisplay="auto"
                  min={volatilityLimits[0]}
                  max={volatilityLimits[1]}
                  step={(volatilityLimits[1] - volatilityLimits[0]) / 100}
                  valueLabelFormat={formatValue}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showDataPoints}
                      onChange={(e) => setShowDataPoints(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Mostrar Pontos de Dados"
                />
              </Grid>
            </Grid>
          </Paper>
          
          <ErrorBoundary>
            <Plot
              data={[
                {
                  type: 'surface',
                  x: filteredData.x,
                  y: filteredData.y,
                  z: filteredData.z,
                  colorscale: 'Viridis',
                  showscale: true,
                  colorbar: {
                    title: 'Volatilidade Implícita(%)',
                    titleside: 'right',
                    thickness: 20,
                    len: 0.8
                  },
                  hoverinfo: 'x+y+z',
                  hoverlabel: {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    bordercolor: '#333',
                    font: { color: '#333' }
                  },
                  contours: {
                    x: { show: false, highlight: false },
                    y: { show: false, highlight: false },
                    z: { 
                      show: false,
                      usecolormap: true,
                      highlightcolor: "#42f462",
                      project: { z: false }
                    }
                  },
                  surfacecolor: filteredData.z,
                  opacity: 0.9,
                  lighting: {
                    roughness: 0.5,
                    ambient: 0.8,
                    diffuse: 0.8,
                    specular: 0.4,
                    fresnel: 0.8
                  }
                },
                ...(showDataPoints && scatterData ? [{
                  type: 'scatter3d',
                  mode: 'markers',
                  x: scatterData.x,
                  y: scatterData.y,
                  z: scatterData.z,
                  text: scatterData.text,
                  hoverinfo: 'text',
                  hoverlabel: {
                    bgcolor: 'rgba(255,255,255,0.9)',
                    bordercolor: '#333',
                    font: { color: '#333' }
                  },
                  marker: {
                    size: 3,
                    color: 'black',
                    opacity: 0.8
                  },
                  name: 'Pontos de Dados',
                  customdata: scatterData.customdata
                }] : [])
              ]}
              layout={layout}
              config={{ 
                responsive: true, 
                displayModeBar: true,
                toImageButtonOptions: {
                  format: 'png',
                  filename: `${ticker}_volatility_surface`,
                  height: 1200,
                  width: 1600,
                  scale: 2
                }
              }}
              style={{ width: '100%', height: '100%' }}
            />
          </ErrorBoundary>
        </Box>
      ) : (
        <Typography>Nenhum dado disponível para o ticker selecionado. Por favor, tente outro ticker.</Typography>
      )}
    </Box>
  );
};

export default VolSurface;