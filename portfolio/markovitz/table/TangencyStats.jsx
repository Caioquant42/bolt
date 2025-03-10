import React from 'react';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Typography
} from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledTableContainer = styled(TableContainer)({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '100%',
  overflowY: 'auto',
});

const StyledTable = styled(Table)({
  minWidth: 'auto',
  "& .MuiTableCell-root": {
    padding: '4px 8px',
    fontSize: '0.7rem',
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  padding: '6px 8px',
  fontSize: '0.75rem',
}));

const formatValue = (key, value) => {
  if (typeof value === 'number') {
    if (key.toLowerCase().includes('return') || key.toLowerCase().includes('drawdown') || key === 'Daily value at risk') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return value.toFixed(2);
  }
  return value;
};

export default function TangencyStats({ data }) {
  console.log('TangencyStats received data:', data);
  console.log('Data in TangencyStats:', data);
  const stats = data?.stats || {};
  console.log('Processed stats:', stats);
  
  if (!stats) {
    return <Typography>Nenhuma estatística disponível</Typography>;
  }
  
  const subscribarList = [
    { name: "Retorno Anual", value: formatValue("Annual return", stats["Annual return"]) },
    { name: "Retorno Acum.", value: formatValue("Cumulative returns", stats["Cumulative returns"]) },
    { name: "Vol. Anual", value: formatValue("Annual volatility", stats["Annual volatility"]) },
    { name: "Sharpe Ratio", value: formatValue("Sharpe ratio", stats["Sharpe ratio"]) },
    { name: "Calmar Ratio", value: formatValue("Calmar ratio", stats["Calmar ratio"]) },
    { name: "Estabilidade", value: formatValue("Stability", stats["Stability"]) },
    { name: "Máx Drawdown", value: formatValue("Max drawdown", stats["Max drawdown"]) },
    { name: "Omega Ratio", value: formatValue("Omega ratio", stats["Omega ratio"]) },
    { name: "Sortino Ratio", value: formatValue("Sortino ratio", stats["Sortino ratio"]) },
    { name: "Assimetria", value: formatValue("Skew", stats["Skew"]) },
    { name: "Curtose", value: formatValue("Kurtosis", stats["Kurtosis"]) },
    { name: "Tail Ratio", value: formatValue("Tail ratio", stats["Tail ratio"]) },
    { name: "VaR 1d", value: formatValue("Daily value at risk", stats["Daily value at risk"]) },
  ];

  return (
    <StyledTableContainer>
      <StyledTable size="small" aria-label="tabela de estatísticas de tangência">
        <TableBody>
          {subscribarList.map((stat, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>{stat.name}</StyledTableCell>
              <TableCell align="right">
                {stat.value !== undefined ? stat.value : 'N/A'}
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
}