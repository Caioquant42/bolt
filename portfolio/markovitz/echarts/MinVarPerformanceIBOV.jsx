import React from 'react';
import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

const MinVarPerformanceIBOV = ({ data = {}, height, width = '100%' }) => {
  const theme = useTheme();

  if (!data || Object.keys(data).length === 0) {
    return <div>No cumulative returns data available</div>;
  }

  const dates = Object.keys(data);
  const portfolioData = dates.map(date => [date, data[date].Portfolio]);
  const benchmarkData = dates.map(date => [date, data[date].Benchmark]);

  const option = {
    title: {
      text: 'Min. Variância vs Benchmark',
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
        return params.map(param => {
          return `${param.seriesName}: ${(param.value[1] * 100).toFixed(2)}%`;
        }).join('<br>');
      }
    },
    legend: {
      data: ['Min. Variância', 'Benchmark'],
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
    series: [
      {
        name: 'Min. Variância',
        data: portfolioData,
        type: "line",
        smooth: true,
        symbol: 'none', // Remove data points
        lineStyle: { width: 3 },
        itemStyle: { color: '#000000' }
      },
      {
        name: 'Benchmark',
        data: benchmarkData,
        type: "line",
        smooth: true,
        symbol: 'none', // Remove data points
        lineStyle: { width: 3 },
        itemStyle: { color: '#FF0000' }
      }
    ]
  };

  return <ReactEcharts style={{ height: height, width: width }} option={option} />;
}

export default MinVarPerformanceIBOV;