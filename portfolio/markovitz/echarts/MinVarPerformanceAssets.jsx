import React from 'react';
import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

// Function to generate random color
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const MinVarPerformanceAssets = ({ data = {}, height, width = '100%' }) => {
  const theme = useTheme();

  if (Object.keys(data).length === 0) {
    return <div>No data available</div>;
  }

  const dates = Object.keys(data);
  const assets = Object.keys(data[dates[0]]).filter(asset => asset !== 'Benchmark');

  // Generate a color map for assets
  const colorMap = assets.reduce((acc, asset) => {
    acc[asset] = asset === 'Portfolio' ? '#000000' : getRandomColor();
    return acc;
  }, {});

  const series = assets.map(asset => ({
    name: asset,
    type: 'line',
    data: dates.map(date => [date, data[date][asset]]),
    smooth: true,
    symbol: 'none', // Remove data points
    lineStyle: { 
      width: asset === 'Portfolio' ? 3 : 2,
      color: colorMap[asset]
    },
    itemStyle: {
      color: colorMap[asset]
    }
  }));

  const option = {
    title: {
      text: 'Performance - Ativos (Min. Variância)',
      left: 'center',
      textStyle: {
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily
      }
    },
    grid: { top: "15%", bottom: "10%", left: "7%", right: "3%" },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        let result = params[0].axisValue + '<br/>';
        params.forEach(param => {
          result += param.marker + ' ' + param.seriesName + ': ' + (param.value[1] * 100).toFixed(2) + '%<br/>';
        });
        return result;
      }
    },
    legend: {
      data: assets,
      top: 30,
      textStyle: {
        color: theme.palette.text.secondary
      }
    },
    xAxis: {
      type: "time",
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 12,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.secondary
      }
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily,
        formatter: function(value) {
          return (value * 100).toFixed(0) + '%';
        }
      }
    },
    series: series
  };

  return <ReactEcharts style={{ height: height, width: width }} option={option} />;
}

export default MinVarPerformanceAssets;