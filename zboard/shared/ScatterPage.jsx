// src/app/views/dashboard/shared/ScatterPage.jsx
import React from 'react';
import { Card, CardContent, CardHeader } from "@mui/material";
import ScatterChart from './echarts/ScatterChart';

const ScatterPage = () => {
  return (
    <Card elevation={3}>
      <CardHeader title="Volatility Analysis Scatter Plot" />
      <CardContent>
        <ScatterChart />
      </CardContent>
    </Card>
  );
};

export default ScatterPage;