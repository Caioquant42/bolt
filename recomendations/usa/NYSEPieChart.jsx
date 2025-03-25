import React, { useState, useEffect, useMemo } from 'react';
import ReactEcharts from "echarts-for-react";
import { useTheme } from "@mui/material/styles";
import { fetchNYSERecommendations } from "/src/__api__/db/apiService";

const RECOMMENDATION_MAPPING = {
  strong_buy: 'Compra Forte',
  buy: 'Compra',
  hold: 'Aguardar',
  underperform: 'Subdesempenho'
};

const RECOMMENDATION_ORDER = ['Compra Forte', 'Compra', 'Aguardar', 'Subdesempenho'];

const CHART_COLORS = [
  ['#56ab2f', '#a8e063'], // Green for 'Compra'
  ['#36D1DC', '#5B86E5'], // Light Blue for 'Compra Forte'
  ['#FF8008', '#FFC837'], // Orange for 'Aguardar'
  ['#cb2d3e', '#ef473a']  // Red for 'Subdesempenho'
];

function NYSEPieChart({ height }) {
  const [chartData, setChartData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const data = await fetchNYSERecommendations();
        const recommendationCount = data.reduce((acc, item) => {
          const label = RECOMMENDATION_MAPPING[item.recommendationKey] || item.recommendationKey;
          acc[label] = (acc[label] || 0) + 1;
          return acc;
        }, {});

        const formattedData = RECOMMENDATION_ORDER
          .filter(key => recommendationCount[key])
          .map(key => ({
            name: key,
            value: recommendationCount[key]
          }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching recommendation data:", error);
        // Handle error state here
      }
    };

    loadChartData();
  }, []);

  const option = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      bottom: -5,
      show: true,
      itemGap: 10,
      icon: "circle",
      textStyle: { color: theme.palette.text.secondary, fontSize: 13, fontFamily: "roboto" }
    },
    series: [
      {
        name: 'Recomendações',
        type: 'pie',
        radius: '70%',
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        stillShowZeroSum: false,
        label: {
          show: true,
          position: 'outside',
          formatter: (params) => `${params.name}\n${params.percent.toFixed(1)}%`,
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
        data: chartData
      }
    ]
  }), [chartData, theme.palette.text.secondary]);

  const colors = useMemo(() => CHART_COLORS.map(([color1, color2]) => ({
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: color1 },
      { offset: 1, color: color2 }
    ]
  })), []);

  return (
    <ReactEcharts
      style={{ height }}
      option={{
        ...option,
        color: colors
      }}
    />
  );
}

export default NYSEPieChart;