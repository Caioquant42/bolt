import React, { useState, useEffect } from "react";
import ReactECharts from 'echarts-for-react';
import { Box, CircularProgress, useTheme, useMediaQuery, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { fetchVolatilityAnalysis } from "/src/__api__/db/apiService";

const ScatterChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('6m');
  const [category, setCategory] = useState('percentile');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchVolatilityAnalysis();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

const getChartOptions = () => {
  const scatterData = data.map(item => [
    item.iv_to_ewma_ratio_current,
    item[`iv_${timeframe}_${category}`],
    item.symbol,
    item.iv_current
  ]);

  const xValues = scatterData.map(item => item[0]);
  const yValues = scatterData.map(item => item[1]);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);
  const xPadding = (maxX - minX) * 0.05;
  const roundedMinX = Math.floor(Math.max(0, minX - xPadding) * 100) / 100;

  // Color function
  const getColor = (x, y) => {
    const normalizedX = (x - minX) / (maxX - minX);
    const normalizedY = (y - minY) / (maxY - minY);
    const value = (normalizedX + normalizedY) / 2; // Average of both axes

    // Gradient from blue to red
    const r = Math.round(255 * value);
    const g = Math.round(100 * (1 - value));
    const b = Math.round(255 * (1 - value));

    return `rgb(${r},${g},${b})`;
  };

  return {
    grid: {
      top: isMobile ? '20%' : '15%',
      right: isMobile ? '15%' : '10%',
      bottom: isMobile ? '15%' : '10%',
      left: isMobile ? '15%' : '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        return `${params.data.value[2]}<br/>
                IV/EWMA Ratio: ${params.data.value[0].toFixed(2)}<br/>
                IV ${timeframe.toUpperCase()} ${category}: ${params.data.value[1].toFixed(2)}<br/>
                IV Current: ${params.data.value[3].toFixed(2)}%`;
      }
    },
    xAxis: {
      name: 'IV/EWMA Ratio Current',
      nameLocation: 'middle',
      nameGap: 30,
      type: 'value',
      min: roundedMinX,
      max: maxX + xPadding,
      axisLabel: {
        fontSize: isMobile ? 10 : 12
      }
    },
    yAxis: {
      name: `IV ${timeframe.toUpperCase()} ${category}`,
      nameLocation: 'middle',
      nameGap: 30,
      type: 'value',
      axisLabel: {
        fontSize: isMobile ? 10 : 12
      }
    },
    series: [{
      type: 'scatter',
      symbolSize: isMobile ? 8 : 12,
      data: scatterData.map(item => ({
        value: item,
        itemStyle: {
          color: getColor(item[0], item[1])
        }
      })),
      label: {
        show: true,  // Always show labels
        formatter: function (param) {
          return param.data.value[2];  // Display the symbol name
        },
        position: 'right',
        fontSize: isMobile ? 8 : 10,
        color: theme.palette.text.primary,
        distance: 5,
        emphasis: {
          show: true
        }
      }
    }]
  };
};

  return (
    <Box sx={{ width: '100%', height: '100%', padding: isMobile ? 1 : 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
        <FormControl size="small">
          <InputLabel>Timeframe</InputLabel>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            label="Timeframe"
          >
            <MenuItem value="6m">6 Months</MenuItem>
            <MenuItem value="1y">1 Year</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="percentile">Percentile</MenuItem>
            <MenuItem value="rank">Rank</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: isMobile ? 'calc(100vh - 150px)' : 'calc(100vh - 100px)' }}>
          <ReactECharts 
            option={getChartOptions()} 
            style={{ 
              height: '100%',
              width: '100%' 
            }}
            opts={{ renderer: 'canvas' }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ScatterChart;