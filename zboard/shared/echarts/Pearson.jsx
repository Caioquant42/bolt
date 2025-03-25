import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import ReactEcharts from "echarts-for-react";
import Slider from "@mui/material/Slider";
import { fetchBenchmarksHistoricalView } from "/src/__api__/db/apiService";
import { sampleCorrelation } from "simple-statistics"; // Named import

const Pearson = ({ height, color = [] }) => {
  const theme = useTheme();
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [startYear, setStartYear] = useState(2010);
  const [endYear, setEndYear] = useState(new Date().getFullYear());
  const [correlationData, setCorrelationData] = useState([]);

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

  // Function to align CDI data with IBOV timestamps
  const alignCDIDataWithIBOV = (cdiData, ibovDates) => {
    const alignedCDIData = {};
    ibovDates.forEach((ibovDate) => {
      const ibovTimestamp = new Date(ibovDate).getTime();
      let closestCDIDate = null;
      let minDiff = Infinity;

      // Find the closest CDI date to the IBOV date
      Object.keys(cdiData).forEach((cdiDate) => {
        const cdiTimestamp = new Date(cdiDate).getTime();
        const diff = Math.abs(ibovTimestamp - cdiTimestamp);
        if (diff < minDiff) {
          minDiff = diff;
          closestCDIDate = cdiDate;
        }
      });

      // Assign the closest CDI value to the IBOV date
      if (closestCDIDate) {
        alignedCDIData[ibovDate] = cdiData[closestCDIDate];
      }
    });

    return alignedCDIData;
  };

  // Convert annual CDI rate to monthly rate
  const convertAnnualToMonthlyRate = (annualRate) => {
    return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  };

  // Calculate rolling Pearson correlation based on the selected year range
  useEffect(() => {
    if (benchmarkData) {
      const calculateRollingCorrelation = (series1, series2, windowSize) => {
        const correlations = [];
        for (let i = 0; i <= series1.length - windowSize; i++) {
          const windowSeries1 = series1.slice(i, i + windowSize);
          const windowSeries2 = series2.slice(i, i + windowSize);

          const validData = windowSeries1
            .map((value, index) => ({
              x: value,
              y: windowSeries2[index],
            }))
            .filter((point) => !isNaN(point.x) && !isNaN(point.y));

          if (validData.length < 2) {
            correlations.push(0); // Not enough data to calculate correlation
          } else {
            const x = validData.map((point) => point.x);
            const y = validData.map((point) => point.y);
            correlations.push(sampleCorrelation(x, y));
          }
        }
        return correlations;
      };

      // Filter data by selected year range
      const filteredDates = Object.keys(benchmarkData.IBOV)
        .filter((date) => {
          const year = new Date(date).getFullYear();
          return year >= startYear && year <= endYear;
        })
        .sort();

      // Align CDI data with IBOV timestamps
      const alignedCDIData = alignCDIDataWithIBOV(benchmarkData.CDI, filteredDates);

      // Convert CDI annual rates to monthly rates
      const cdiMonthlyRates = filteredDates.map((date) =>
        convertAnnualToMonthlyRate(alignedCDIData[date] || 0)
      );

      // Extract IBOV data
      const ibovData = filteredDates.map((date) => benchmarkData.IBOV[date]);

      // Calculate rolling correlation for each series
      const windowSize = 12; // 12 months rolling window
      const cdiCorrelation = calculateRollingCorrelation(cdiMonthlyRates, ibovData, windowSize);
      const sp500Correlation = calculateRollingCorrelation(
        filteredDates.map((date) => benchmarkData.SP500[date] || 0),
        ibovData,
        windowSize
      );
      const goldCorrelation = calculateRollingCorrelation(
        filteredDates.map((date) => benchmarkData.Gold[date] || 0),
        ibovData,
        windowSize
      );
      const usdbrlCorrelation = calculateRollingCorrelation(
        filteredDates.map((date) => benchmarkData.USDBRL[date] || 0),
        ibovData,
        windowSize
      );

      // Combine correlation data
      const chartData = filteredDates.slice(windowSize - 1).map((date, index) => ({
        date,
        CDI: cdiCorrelation[index],
        SP500: sp500Correlation[index],
        Gold: goldCorrelation[index],
        USDBRL: usdbrlCorrelation[index],
      }));

      setCorrelationData(chartData);
    }
  }, [benchmarkData, startYear, endYear]);

  // Slider change handler
  const handleYearChange = (event, newValue) => {
    setStartYear(newValue[0]);
    setEndYear(newValue[1]);
  };

  // Get the minimum and maximum years from the data
  const minYear = benchmarkData
    ? Math.min(...Object.keys(benchmarkData.IBOV).map((date) => new Date(date).getFullYear()))
    : 2010;
  const maxYear = benchmarkData
    ? Math.max(...Object.keys(benchmarkData.IBOV).map((date) => new Date(date).getFullYear()))
    : new Date().getFullYear();

  // Chart options
  const option = {
    title: {
      text: "Correlação de Pearson com o IBOV",
      left: "center",
      textStyle: {
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
      },
    },
    grid: { top: "15%", bottom: "15%", left: "3%", right: "3%" },
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        let result = `${params[0].axisValue}<br/>`;
        params.forEach((param) => {
          const value = param.value || 0; // Default to 0 if value is missing
          result += `${param.seriesName}: ${value.toFixed(2)}<br/>`;
        });
        return result;
      },
    },
    legend: {
      data: ["CDI", "Dólar", "Ouro", "S&P 500"],
      bottom: 0,
    },
    xAxis: {
      type: "category",
      data: correlationData.map((item) => item.date),
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
      min: -1,
      max: 1,
      interval: 0.2,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        lineStyle: { color: theme.palette.text.secondary, opacity: 0.15 },
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontSize: 12,
        fontFamily: theme.typography.fontFamily,
        formatter: "{value}",
      },
    },
    series: [
      {
        name: "CDI",
        data: correlationData.map((item) => item.CDI),
        type: "line",
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
      {
        name: "Dólar",
        data: correlationData.map((item) => item.USDBRL),
        type: "line",
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
      {
        name: "Ouro",
        data: correlationData.map((item) => item.Gold),
        type: "line",
        smooth: true,
        symbolSize: 6,
        lineStyle: { width: 2 },
      },
      {
        name: "S&P 500",
        data: correlationData.map((item) => item.SP500),
        type: "line",
        smooth: true,
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

export default Pearson;