// AgendaTable.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
  Typography,
  TableSortLabel
} from "@mui/material";
import { fetchDividendAgenda } from "/src/__api__/db/apiService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: '6px 8px',
  fontSize: '0.75rem',
  textAlign: 'center',
  cursor: 'pointer',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

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

const AgendaTable = () => {
  const [agendaData, setAgendaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'Ex', direction: 'descending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDividendAgenda();
        setAgendaData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dividend agenda data:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const sortedData = [...agendaData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setAgendaData(sortedData);
  }, [sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (error) return <Box color="error.main">{error}</Box>;

  return (
    <Box>
      <StyledTableContainer>
        <StyledTable size="small" aria-label="tabela de agenda de dividendos">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === 'Codigo'}
                  direction={sortConfig.key === 'Codigo' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('Codigo')}
                >
                  Código
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === 'Tipo'}
                  direction={sortConfig.key === 'Tipo' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('Tipo')}
                >
                  Tipo
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align="center">
                <TableSortLabel
                  active={sortConfig.key === 'Valor (R$)'}
                  direction={sortConfig.key === 'Valor (R$)' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('Valor (R$)')}
                >
                  Valor (R$)
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === 'Registro'}
                  direction={sortConfig.key === 'Registro' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('Registro')}
                >
                  Registro
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === 'Ex'}
                  direction={sortConfig.key === 'Ex' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('Ex')}
                >
                  Ex
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === 'Pagamento'}
                  direction={sortConfig.key === 'Pagamento' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('Pagamento')}
                >
                  Pagamento
                </TableSortLabel>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendaData.map((item, index) => (
              <StyledTableRow key={index}>
                <TableCell align="center">{item.Codigo}</TableCell>
                <TableCell align="center">{item.Tipo}</TableCell>
                <TableCell align="center">{item["Valor (R$)"]}</TableCell>
                <TableCell align="center">{item.Registro}</TableCell>
                <TableCell align="center">{item.Ex}</TableCell>
                <TableCell align="center">{item.Pagamento}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </Box>
  );
};

export default AgendaTable;