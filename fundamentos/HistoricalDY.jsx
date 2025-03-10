import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import ReactECharts from 'echarts-for-react';
import { fetchHistoricalDY } from "/src/__api__/db/apiService";

const HistoricalDY = () => {
  const [historicalData, setHistoricalData] = useState({});
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [availableStocks, setAvailableStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchHistoricalDY();
        setHistoricalData(data);
        setAvailableStocks(Object.keys(data));
        setLoading(false);
      } catch (err) {
        setError("Falha ao buscar dados. Por favor, tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStockSelection = (event, newValue) => {
    setSelectedStocks(newValue);
  };

  const getChartOption = () => {
    const allYears = [...new Set(
      selectedStocks.flatMap(stock => 
        historicalData[stock].map(item => parseInt(item.Ano))
      )
    )].sort((a, b) => a - b);

    const series = selectedStocks.map(stock => {
      const stockData = historicalData[stock];
      const dataMap = new Map(stockData.map(item => [parseInt(item.Ano), parseFloat(item.DY.replace('%', ''))]));

      return {
        name: stock,
        type: 'line',
        data: allYears.map(year => ({
          value: dataMap.get(year) || null,
          year: year.toString()
        })),
        connectNulls: true
      };
    });

    return {
      title: {
        text: 'Comparação Histórica de Dividend Yield'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          return params
            .filter(param => param.value !== null)
            .map(param => `${param.seriesName}: ${param.value.toFixed(2)}% (${param.data.year})`)
            .join('<br>');
        }
      },
      legend: {
        data: selectedStocks
      },
      xAxis: {
        type: 'category',
        data: allYears.map(String)
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: series
    };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box my={4}>
      <Autocomplete
        multiple
        value={selectedStocks}
        onChange={handleStockSelection}
        options={availableStocks}
        renderInput={(params) => (
          <TextField {...params} label="Selecione as Ações" variant="outlined" />
        )}
        sx={{ mb: 4 }}
      />
      {selectedStocks.length > 0 ? (
        <ReactECharts
          option={getChartOption()}
          style={{ height: '400px' }}
        />
      ) : (
        <Typography>Por favor, selecione uma ou mais ações para exibir o gráfico.</Typography>
      )}
    </Box>
  );
};

export default HistoricalDY;