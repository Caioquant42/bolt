import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { fetchIBOVendpoint } from "/src/__api__/db/apiService";
import sectorsData from './sectors.json';
import { useTheme, useMediaQuery } from '@mui/material';

const SunburstStocks = () => {
  const [data, setData] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchIBOVendpoint();
      if (response && !response.error) {
        const processedData = processStockData(response);
        setData(processedData);
      }
    };
    fetchData();
  }, []);

  const getSector = (symbol) => {
    const shortSymbol = symbol.substring(0, 4);
    return sectorsData[shortSymbol] || "Unknown Sector";
  };

  const formatSectorName = (sector) => {
    return isMobile ? sector : sector.split(' ').join('\n');
  };

  const processStockData = (stocks) => {
    const sectors = {};

    stocks.forEach(stock => {
      const stockSector = getSector(stock.symbol);
      const formattedSector = formatSectorName(stockSector);
      
      if (!sectors[formattedSector]) {
        sectors[formattedSector] = [];
      }
      
      sectors[formattedSector].push({
        name: stock.symbol,
        value: Math.abs(stock.variation),
        itemStyle: {
          color: getColorByVariation(stock.variation)
        }
      });
    });

    return Object.keys(sectors).map(sector => ({
      name: sector,
      children: sectors[sector]
    }));
  };

  const getColorByVariation = (variation) => {
    const absVariation = Math.abs(variation);
    if (variation > 0) {
      return `rgb(0, ${Math.min(255, Math.round(absVariation * 25))}, 0)`;
    } else {
      return `rgb(${Math.min(255, Math.round(absVariation * 25))}, 0, 0)`;
    }
  };

  const option = {
    title: {
      text: 'Variação IBOVESPA',
      textStyle: {
        fontSize: isMobile ? 12 : 14,
        align: 'center'
      },
      top: isMobile ? 5 : 10,
      left: 'center'
    },
    tooltip: {
      formatter: function (params) {
        const value = params.data.value.toFixed(2);
        const sign = params.data.itemStyle.color.includes('rgb(0,') ? '+' : '-';
        return `${params.name.replace(/\n/g, ' ')}: ${sign}${value}%`;
      }
    },
    series: {
      type: 'sunburst',
      data: data,
      radius: [0, isMobile ? '90%' : '95%'],
      sort: null,
      emphasis: {
        focus: 'ancestor'
      },
      levels: [
        {},
        {
          r0: isMobile ? '20%' : '15%',
          r: isMobile ? '40%' : '45%',
          itemStyle: {
            borderWidth: isMobile ? 1 : 2
          },
          label: {
            rotate: 'tangential',
            fontSize: isMobile ? 8 : 10,
            align: 'center'
          }
        },
        {
          r0: isMobile ? '40%' : '45%',
          r: isMobile ? '70%' : '75%',
          label: {
            align: 'right',
            fontSize: isMobile ? 8 : 10
          }
        },
        {
          r0: isMobile ? '70%' : '75%',
          r: isMobile ? '72%' : '77%',
          label: {
            position: 'outside',
            padding: isMobile ? 2 : 3,
            silent: false,
            fontSize: isMobile ? 8 : 10
          },
          itemStyle: {
            borderWidth: isMobile ? 2 : 3
          }
        }
      ]
    }
  };

  return (
    <ReactECharts 
      option={option} 
      style={{ 
        height: '100%',
        width: '100%',
        minHeight: isMobile ? '350px' : '600px'
      }}
      opts={{ 
        renderer: 'canvas',
        devicePixelRatio: window.devicePixelRatio
      }}
    />
  );
};

export default SunburstStocks;
