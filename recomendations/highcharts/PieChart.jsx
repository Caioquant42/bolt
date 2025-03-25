import React from 'react';
import ReactEcharts from "echarts-for-react";
import { useTheme } from "@mui/material/styles";

function PieChart({ height, color = [] }) {
  const theme = useTheme();

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      bottom: 0,
      show: true,
      itemGap: 20,
      icon: "circle",
      textStyle: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: "roboto" }
    },
    series: [
      {
        name: 'Share',
        type: 'pie',
        radius: '70%',
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        stillShowZeroSum: false,
        label: {
          show: true,
          position: 'outside',
          formatter: (params) => {
            return `${params.name}\n${params.percent.toFixed(1)}%`;
          },
          fontSize: 12,
          fontFamily: "roboto",
          color: theme.palette.text.secondary
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: true,
          length: 10,
          length2: 10
        },
        data: [
          { value: 938899, name: 'Petrol' },
          { value: 1229600, name: 'Diesel' },
          { value: 325251, name: 'Electricity' },
          { value: 238751, name: 'Other' }
        ]
      }
    ]
  };

  return (
    <ReactEcharts
      style={{ height }}
      option={{
        ...option,
        color: color.length > 0 ? color : undefined
      }}
    />
  );
}

export default PieChart;