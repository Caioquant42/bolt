import React from 'react';
import { Card } from '@mui/material';
import TreeMap from './echarts/TreeMap';

const TreeMapPage = () => {
  return (
    <Card>
      <h3>Visão de Mercado (TreeMap)</h3>
      <TreeMap />
    </Card>
  );
};

export default TreeMapPage;