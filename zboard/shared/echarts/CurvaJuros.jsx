import React from 'react';
import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";

const CurvaJuros = ({ height, color = [] }) => {
  const theme = useTheme();

  const data = [
    { year: 2026, rate: 15.020 },
    { year: 2027, rate: 15.190 },
    { year: 2028, rate: 14.990 },
    { year: 2029, rate: 14.900 },
    { year: 2030, rate: 14.880 },
    { year: 2031, rate: 14.820 },
    { year: 2032, rate: 14.830 },
    { year: 2033, rate: 14.770 }
  ];

  const option = {
    title: {
      text: 'Curva de Juros',
      left: 'center',
      textStyle: {
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily
      }
    },
    grid: { top: "10%", bottom: "10%", left: "5%", right: "5%" },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        return `Ano: ${params[0].name}<br/>Taxa: ${params[0].value}%`;
      }
    },
    xAxis: {
      type: "category",
      data: data.map(item => item.year),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 14,
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
        fontSize: 13,
        fontFamily: theme.typography.fontFamily,
        formatter: '{value}%'
      }
    },
    series: [
      {
        data: data.map(item => item.rate),
        type: "line",
        name: "Taxa de Juros",
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 4 }
      }
    ]
  };

  return <ReactEcharts style={{ height: height }} option={{ ...option, color: [...color] }} />;
}

export default CurvaJuros;