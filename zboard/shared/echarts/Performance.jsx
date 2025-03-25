import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";
import Slider from "@mui/material/Slider";
import { fetchBenchmarksHistoricalView } from "/src/__api__/db/apiService";

const Performance = ({ height, color = [] }) => {
  const theme = useTheme();
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [startYear, setStartYear] = useState(2010);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [cumulativeReturns, setCumulativeReturns] = useState([]);

  // Fetch benchmark data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBenchmarksHistoricalView();
        setBenchmarkData(data);
      } catch (error) {
        console.error("Error fetching benchmark data:", error);
      }
    };
    fetchData();
  }, []);

  // Calculate cumulative returns based on the selected year range
  useEffect(() => {
    if (benchmarkData) {
      const calculateCumulativeReturns = (data, isCDI = false) => {
        const sortedDates = Object.keys(data).sort();
        const cumulativeData = {};
        let cumulativeProduct = 1; // Start with 1 (100%)

        sortedDates.forEach((date, index) => {
          const year = new Date(date).getFullYear();
          if (year >= startYear && year <= endYear) {
            const value = data[date];
            if (isCDI) {
              // Convert annualized CDI to monthly rate
              const monthlyRate = (1 + value / 100) ** (1 / 12) - 1;
              cumulativeProduct *= 1 + monthlyRate;
            } else {
              // For other series, calculate percentage change
              if (index > 0) {
                const previousDate = sortedDates[index - 1];
                const previousValue = data[previousDate];
                if (previousValue !== undefined && previousValue !== 0) {
                  const returnValue = (value - previousValue) / previousValue;
                  cumulativeProduct *= 1 + returnValue;
                }
              }
            }
            cumulativeData[date] = (cumulativeProduct - 1) * 100; // Convert to percentage
          }
        });

        return cumulativeData;
      };

      // Get all unique dates from all series
      const allDates = [
        ...new Set([
          ...Object.keys(benchmarkData.CDI),
          ...Object.keys(benchmarkData.SP500),
          ...Object.keys(benchmarkData.Gold),
          ...Object.keys(benchmarkData.USDBRL),
          ...Object.keys(benchmarkData.IBOV),
        ]),
      ].sort();

      // Calculate cumulative returns for each series
      const cdiReturns = calculateCumulativeReturns(benchmarkData.CDI, true);
      const sp500Returns = calculateCumulativeReturns(benchmarkData.SP500);
      const goldReturns = calculateCumulativeReturns(benchmarkData.Gold);
      const usdbrlReturns = calculateCumulativeReturns(benchmarkData.USDBRL);
      const ibovReturns = calculateCumulativeReturns(benchmarkData.IBOV);

      // Combine all cumulative returns into a single array for the chart
      const chartData = allDates.map((date) => ({
        date,
        CDI: cdiReturns[date] || 0,
        SP500: sp500Returns[date] || 0,
        Gold: goldReturns[date] || 0,
        USDBRL: usdbrlReturns[date] || 0,
        IBOV: ibovReturns[date] || 0,
      }));

      setCumulativeReturns(chartData);
    }
  }, [benchmarkData, startYear, endYear]);

  // Slider change handler
  const handleYearChange = (event, newValue) => {
    setStartYear(newValue[0]);
    setEndYear(newValue[1]);
  };

  // Get the minimum and maximum years from the data
  const minYear = benchmarkData
    ? Math.min(...Object.keys(benchmarkData.CDI).map((date) => new Date(date).getFullYear()))
    : 2010;
  const maxYear = benchmarkData
    ? Math.max(...Object.keys(benchmarkData.CDI).map((date) => new Date(date).getFullYear()))
    : new Date().getFullYear();

  // Chart options
  const option = {
    title: {
      text: "Performance Relativa dos Ativos",
      left: "center",
      textStyle: {
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
      },
    },
    grid: { top: "10%", bottom: "10%", left: "3%", right: "3%" },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param) => {
          const value = param.value || 0; // Default to 0 if value is missing
          result += `${param.seriesName}: ${value.toFixed(2)}%<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ["IBOV", "CDI", "Dólar", "Ouro", "S&P 500"],
      bottom: 0,
    },
    xAxis: {
      type: "category",
      data: cumulativeReturns.map((item) => item.date),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 12,
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.secondary,
      },
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 },
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily,
        formatter: "{value}%",
      },
    },
    series: [
      {
        name: "IBOV",
        data: cumulativeReturns.map((item) => item.IBOV),
        type: "line",
        smooth: true, // Enable smoothing
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
      {
        name: "CDI",
        data: cumulativeReturns.map((item) => item.CDI),
        type: "line",
        smooth: true, // Enable smoothing
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
      {
        name: "Dólar",
        data: cumulativeReturns.map((item) => item.USDBRL),
        type: "line",
        smooth: true, // Enable smoothing
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
      {
        name: "Ouro",
        data: cumulativeReturns.map((item) => item.Gold),
        type: "line",
        smooth: true, // Enable smoothing
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
      {
        name: "S&P 500",
        data: cumulativeReturns.map((item) => item.SP500),
        type: "line",
        smooth: true, // Enable smoothing
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
    ],
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Slider for year range */}
      <div style={{ marginTop: "40px", marginBottom: "20px" }}>
        <Slider
          value={[startYear, endYear]}
          onChange={handleYearChange}
          min={minYear}
          max={maxYear}
          valueLabelDisplay="auto"
          aria-labelledby="range-slider"
          sx={{ 
            width: "100%", 
            margin: "0 auto", 
          }}
        />
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ReactEcharts
          style={{ height: height }}
          option={{ ...option, color: [...color] }}
        />
      </div>
    </div>
  );
};

export default Performance;