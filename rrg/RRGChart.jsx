import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { fetchRRGINDEXView } from '/src/__api__/db/apiService';
import { 
  Box, 
  CircularProgress, 
  Typography, 
  Autocomplete, 
  TextField, 
  Chip,
  Paper,
  FormControlLabel,
  Switch
} from '@mui/material';

const RRGChart = () => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 1400, height: 1000 });
  const [rrgData, setRrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTickers, setSelectedTickers] = useState([]);
  const [showAllTickers, setShowAllTickers] = useState(true);

  // Fetch RRG data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchRRGINDEXView();
        
        // Log the data to help with debugging
        console.log("RRG Data received:", data);
        
        // Validate data structure before setting state
        if (data && Object.keys(data).length > 0) {
          setRrgData(data);
          setError(null);
        } else {
          setError('No data available from the API. Please try again later.');
        }
      } catch (error) {
        console.error('Error fetching RRG data:', error);
        setError('Failed to load RRG data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get available tickers from the data
  const availableTickers = useMemo(() => {
    if (!rrgData) return [];
    return Object.keys(rrgData);
  }, [rrgData]);

  // Handle resizing of the chart container
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Filter data based on selected tickers
  const filteredData = useMemo(() => {
    if (!rrgData) return null;
    
    if (showAllTickers) {
      return rrgData;
    }
    
    if (selectedTickers.length === 0) {
      // If no tickers are selected but showAllTickers is false, show nothing
      return {};
    }
    
    // Create a new object with only the selected tickers
    return selectedTickers.reduce((acc, ticker) => {
      if (rrgData[ticker]) {
        acc[ticker] = rrgData[ticker];
      }
      return acc;
    }, {});
  }, [rrgData, selectedTickers, showAllTickers]);

  // Render the RRG chart when dimensions or filtered data change
  useEffect(() => {
    if (!filteredData || Object.keys(filteredData).length === 0) return;
    
    // Ensure we have valid dimensions
    const width = dimensions.width || 1400;
    const height = dimensions.height || 1000;
    
    if (width === 0 || height === 0) return;
    
    console.log("Rendering chart with dimensions:", width, height);
    console.log("Data sample:", Object.keys(filteredData).slice(0, 2));

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Increase margins to give more space for axis labels
    const margin = { top: 40, right: 120, bottom: 80, left: 80 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Set domain ranges for the chart based on data
    // Find min and max values for better scaling
    let minRatio = 95;
    let maxRatio = 105;
    let minMomentum = 95;
    let maxMomentum = 105;
    
    Object.keys(filteredData).forEach(symbol => {
      const ratios = filteredData[symbol]['RS-Ratio'] || [];
      const momenta = filteredData[symbol]['RS-Momentum'] || [];
      
      if (ratios.length > 0) {
        minRatio = Math.min(minRatio, ...ratios);
        maxRatio = Math.max(maxRatio, ...ratios);
      }
      
      if (momenta.length > 0) {
        minMomentum = Math.min(minMomentum, ...momenta);
        maxMomentum = Math.max(maxMomentum, ...momenta);
      }
    });
    
    // Add some padding to the domains
    minRatio = Math.floor(minRatio - 1);
    maxRatio = Math.ceil(maxRatio + 1);
    minMomentum = Math.floor(minMomentum - 1);
    maxMomentum = Math.ceil(maxMomentum + 1);
    
    console.log("Domain ranges:", minRatio, maxRatio, minMomentum, maxMomentum);

    const x = d3.scaleLinear().domain([minRatio, maxRatio]).range([0, innerWidth]);
    const y = d3.scaleLinear().domain([minMomentum, maxMomentum]).range([innerHeight, 0]);

    // Create the main group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add colored quadrants - using 100 as the center point
    const centerX = 100;
    const centerY = 100;
    
    g.append('rect')
      .attr('x', x(centerX))
      .attr('y', y(maxMomentum))
      .attr('width', x(maxRatio) - x(centerX))
      .attr('height', y(centerY) - y(maxMomentum))
      .attr('fill', 'rgba(0, 255, 0, 0.1)');
    g.append('rect')
      .attr('x', x(minRatio))
      .attr('y', y(maxMomentum))
      .attr('width', x(centerX) - x(minRatio))
      .attr('height', y(centerY) - y(maxMomentum))
      .attr('fill', 'rgba(255, 255, 0, 0.1)');
    g.append('rect')
      .attr('x', x(minRatio))
      .attr('y', y(centerY))
      .attr('width', x(centerX) - x(minRatio))
      .attr('height', y(minMomentum) - y(centerY))
      .attr('fill', 'rgba(255, 0, 0, 0.1)');
    g.append('rect')
      .attr('x', x(centerX))
      .attr('y', y(centerY))
      .attr('width', x(maxRatio) - x(centerX))
      .attr('height', y(minMomentum) - y(centerY))
      .attr('fill', 'rgba(0, 0, 255, 0.1)');

    // Add x-axis with improved styling
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x)
        .ticks(10)
        .tickFormat(d3.format('.0f')) // Format as integers
      );
    
    // Remove domain line
    xAxis.select('.domain').remove();
    
    // Add grid lines
    xAxis.selectAll('.tick line')
      .clone()
      .attr('y2', -innerHeight)
      .attr('stroke-opacity', 0.1);
    
    // Add x-axis label
    xAxis.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', 40) // Position below the axis
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Relative Strength (RS-Ratio)');

    // Add y-axis with improved styling
    const yAxis = g.append('g')
      .call(d3.axisLeft(y)
        .ticks(10)
        .tickFormat(d3.format('.0f')) // Format as integers
      );
    
    // Remove domain line
    yAxis.select('.domain').remove();
    
    // Add grid lines
    yAxis.selectAll('.tick line')
      .clone()
      .attr('x2', innerWidth)
      .attr('stroke-opacity', 0.1);
    
    // Add y-axis label
    yAxis.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -60) // Position to the left of the axis
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .text('Relative Momentum (RS-Momentum)');

    // Add center lines
    g.append('line')
      .attr('x1', x(minRatio))
      .attr('x2', x(maxRatio))
      .attr('y1', y(centerY))
      .attr('y2', y(centerY))
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '4');
    g.append('line')
      .attr('x1', x(centerX))
      .attr('x2', x(centerX))
      .attr('y1', y(minMomentum))
      .attr('y2', y(maxMomentum))
      .attr('stroke', '#666')
      .attr('stroke-dasharray', '4');

    // Create line generator with curve
    const line = d3
      .line()
      .curve(d3.curveCatmullRom)
      .x((d) => x(d.relativeStrength))
      .y((d) => y(d.relativeMomentum))
      .defined(d => !isNaN(d.relativeStrength) && !isNaN(d.relativeMomentum));

    // Color scale for different stocks
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Transform API data into a format suitable for the chart
    const chartData = [];
    
    Object.keys(filteredData).forEach((symbol, index) => {
      const dates = filteredData[symbol].Dates || [];
      const rsRatios = filteredData[symbol]['RS-Ratio'] || [];
      const rsMomenta = filteredData[symbol]['RS-Momentum'] || [];
      
      // Skip if any of the arrays are empty
      if (dates.length === 0 || rsRatios.length === 0 || rsMomenta.length === 0) {
        return;
      }
      
      const symbolData = dates.map((date, i) => {
        return {
          symbol,
          date,
          relativeStrength: rsRatios[i],
          relativeMomentum: rsMomenta[i],
          color: colorScale(index)
        };
      }).filter(d => !isNaN(d.relativeStrength) && !isNaN(d.relativeMomentum));
      
      // Only add if we have valid data points
      if (symbolData.length > 0) {
        chartData.push(symbolData);
      }
    });
    
    console.log("Processed chart data:", chartData.length, "series");

    // Draw lines and points for each symbol
    chartData.forEach((data) => {
      if (data.length < 2) return; // Need at least 2 points to draw a line
      
      const symbol = data[0].symbol;
      const color = data[0].color;
      
      console.log(`Drawing series for ${symbol} with ${data.length} points`);
      
      // Draw the path
      const path = g
        .append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', 3) // Increased line thickness
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', line);

      // Animate the path
      const length = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', `0,${length}`)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr('stroke-dasharray', `${length},${length}`);

      // Draw points except for the last one
      g.selectAll(`.point-${symbol}`)
        .data(data.slice(0, -1))
        .join('circle')
        .attr('class', `point-${symbol}`)
        .attr('cx', (d) => x(d.relativeStrength))
        .attr('cy', (d) => y(d.relativeMomentum))
        .attr('r', 6) // Increased point size
        .attr('fill', 'white')
        .attr('stroke', color)
        .attr('stroke-width', 2.5);

      // Add arrow to the last point if we have at least 2 points
      if (data.length >= 2) {
        const lastPoint = data[data.length - 1];
        const secondLastPoint = data[data.length - 2];
        
        // Calculate angle for the arrow
        const dx = x(lastPoint.relativeStrength) - x(secondLastPoint.relativeStrength);
        const dy = y(lastPoint.relativeMomentum) - y(secondLastPoint.relativeMomentum);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        g.append('path')
          .attr('d', d3.symbol().type(d3.symbolTriangle).size(150)) // Increased arrow size
          .attr('fill', color)
          .attr('transform', `translate(${x(lastPoint.relativeStrength)},${y(lastPoint.relativeMomentum)}) rotate(${angle})`)
          .style('opacity', 0)
          .transition()
          .delay(2000)
          .duration(500)
          .style('opacity', 1);
      }

      // Add labels with animation
      g.append('text')
        .attr('x', x(data[data.length - 1].relativeStrength))
        .attr('y', y(data[data.length - 1].relativeMomentum) - 12) // Increased offset
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px') // Increased font size
        .attr('font-weight', 'bold')
        .attr('fill', color)
        .text(symbol)
        .style('opacity', 0)
        .transition()
        .delay(2200)
        .duration(500)
        .style('opacity', 1);
    });

    // Add legend with scrollable container if there are many items
    const legendContainer = svg
      .append('g')
      .attr('transform', `translate(${width - margin.right + 20},${margin.top})`);
    
    // Create a clipping path for the legend
    svg.append('defs')
      .append('clipPath')
      .attr('id', 'legend-clip')
      .append('rect')
      .attr('width', margin.right - 20)
      .attr('height', height - margin.top - margin.bottom);
    
    const legend = legendContainer
      .append('g')
      .attr('clip-path', 'url(#legend-clip)');

    chartData.forEach((data, index) => {
      const legendItem = legend
        .append('g')
        .attr('transform', `translate(0,${index * 24})`); // Increased spacing

      legendItem
        .append('rect')
        .attr('width', 14) // Increased size
        .attr('height', 14) // Increased size
        .attr('fill', data[0].color);

      legendItem
        .append('text')
        .attr('x', 20) // Increased offset
        .attr('y', 12) // Adjusted for vertical centering
        .attr('font-size', '13px') // Increased font size
        .text(data[0].symbol);
    });

    // Add quadrant labels with larger font
    const quadrantLabels = [
      { x: x((centerX + maxRatio) / 2), y: y((centerY + maxMomentum) / 2), text: "Liderando", align: "middle" },
      { x: x((centerX + minRatio) / 2), y: y((centerY + maxMomentum) / 2), text: "Melhorando", align: "middle" },
      { x: x((centerX + minRatio) / 2), y: y((centerY + minMomentum) / 2), text: "Atrasado", align: "middle" },
      { x: x((centerX + maxRatio) / 2), y: y((centerY + minMomentum) / 2), text: "Enfraquecendo", align: "middle" }
    ];

    quadrantLabels.forEach(label => {
      g.append('text')
        .attr('x', label.x)
        .attr('y', label.y)
        .attr('text-anchor', label.align)
        .attr('font-size', '16px') // Increased font size
        .attr('font-weight', 'bold')
        .attr('fill', '#666')
        .text(label.text);
    });

    // Add chart title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '18px')
      .attr('font-weight', 'bold')
      .text('Relative Rotation Graph (RRG)');

  }, [dimensions, filteredData]);

  // Handle ticker selection
  const handleTickerChange = (event, newValue) => {
    setSelectedTickers(newValue);
  };

  // Toggle between showing all tickers or only selected ones
  const handleToggleAllTickers = (event) => {
    setShowAllTickers(event.target.checked);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="800px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="800px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={showAllTickers}
                onChange={handleToggleAllTickers}
                color="primary"
              />
            }
            label="Mostrar todos os ativos"
          />
          
          <Autocomplete
            multiple
            id="ticker-selector"
            options={availableTickers}
            value={selectedTickers}
            onChange={handleTickerChange}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Selecionar ativos"
                placeholder="Digite para buscar"
                sx={{ minWidth: 300 }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            disabled={showAllTickers}
            sx={{ flexGrow: 1 }}
          />
        </Box>
      </Paper>
      
      <Box 
        ref={containerRef} 
        sx={{ 
          width: '100%', 
          height: '1000px', 
          flexGrow: 1,
          border: '1px solid rgba(0, 0, 0, 0.12)',
          borderRadius: '4px',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ minHeight: '1000px' }}
        ></svg>
      </Box>
    </Box>
  );
};

export default RRGChart;