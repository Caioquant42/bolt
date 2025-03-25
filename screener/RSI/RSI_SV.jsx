import React, { useState, useEffect } from "react";
import { Small } from "app/components/Typography";
import { MatxProgressBar, SimpleCard } from "app/components";
import { fetchRSIAnalysis } from "/src/__api__/db/apiService";

export default function RSISV() {
  const [rsiData, setRsiData] = useState({
    "15m": { overbought: [], oversold: [] },
    "60m": { overbought: [], oversold: [] },
    "1d": { overbought: [], oversold: [] },
    "1w": { overbought: [], oversold: [] }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchRSIAnalysis();
        setRsiData(result);
      } catch (error) {
        console.error("Error fetching RSI analysis:", error);
      }
    };
    fetchData();
  }, []);

  const getColor = (rsi) => {
    if (rsi < 20) return "success";
    if (rsi < 30) return "primary";
    return "secondary";
  };

  const renderRSICard = (title, data, interval) => (
    <SimpleCard title={title} sx={{ marginTop: 3 }}>
      <Small color="text.secondary" display="block" mb={2}>
        {interval} Values
      </Small>
      {data.map((item, index) => (
        <MatxProgressBar
          key={`${interval}-${index}`}
          value={item.RSI}
          color={getColor(item.RSI)}
          text={`${item.Symbol} (${item.RSI.toFixed(2)})`}
        />
      ))}
    </SimpleCard>
  );

  return (
    <div>
      {renderRSICard("Sobrevendido - 15 Minutos", rsiData["15m"].oversold, "15 Minutes")}
      {renderRSICard("Sobrevendido - 60 Minutos", rsiData["60m"].oversold, "60 Minutes")}
      {renderRSICard("Sobrevendido - Diário", rsiData["1d"].oversold, "1 Day")}
      {renderRSICard("Sobrevendido - Semanal", rsiData["1w"].oversold, "1 Week")}
    </div>
  );
}