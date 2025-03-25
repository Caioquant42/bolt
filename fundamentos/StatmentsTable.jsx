// StatmentsTable.jsx
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
  TextField,
  Autocomplete,
  Tabs,
  Tab
} from "@mui/material";
import { fetchStatments } from "/src/__api__/db/apiService";

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

const StatmentsTable = () => {
  const [statementsData, setStatementsData] = useState({});
  const [tickers, setTickers] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState("PETR4");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Indicators');

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const data = await fetchStatments();
        setTickers(Object.keys(data));
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tickers:", error);
        setError("Failed to load tickers. Please try again later.");
        setLoading(false);
      }
    };

    fetchTickers();
  }, []);

  useEffect(() => {
    if (!selectedTicker) return;

    const fetchDataForTicker = async () => {
      setLoading(true);
      try {
        const data = await fetchStatments();
        setStatementsData(data[selectedTicker]);
      } catch (error) {
        console.error(`Failed to fetch statements for ${selectedTicker}:`, error);
        setError("Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDataForTicker();
  }, [selectedTicker]);

  const sortColumns = (columns) => {
    const quarterlyPattern = /^[1-4]T\d{4}$/;
    const yearlyPattern = /^\d{4}$/;

    return columns.sort((a, b) => {
      if (a === '3T2024 (TTM)') return -1;
      if (b === '3T2024 (TTM)') return 1;

      const aMatch = a.match(quarterlyPattern) || a.match(yearlyPattern);
      const bMatch = b.match(quarterlyPattern) || b.match(yearlyPattern);

      if (aMatch && bMatch) {
        const [aYear, aQuarter] = aMatch[0].split('T').reverse();
        const [bYear, bQuarter] = bMatch[0].split('T').reverse();

        if (aYear !== bYear) {
          return parseInt(bYear) - parseInt(aYear);
        }
        
        if (aQuarter && bQuarter) {
          return parseInt(bQuarter) - parseInt(aQuarter);
        }
      }

      return a.localeCompare(b);
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  if (error) {
    return <Box color="error.main">{error}</Box>;
  }

  if (!statementsData || Object.keys(statementsData).length === 0) {
    return <Typography color="textSecondary">No data available for the selected stock.</Typography>;
  }

  const tableData = statementsData[activeTab] || [];
  let columns = tableData.length > 0 
    ? sortColumns(Object.keys(tableData[0]).filter(col => col !== 'Conta'))
    : [];

  // Limit to 10 columns for Balance Sheet and Tri Results
  if (activeTab === 'BalanceSheet' || activeTab === 'TriResults') {
    columns = columns.slice(0, 10);
  }

  return (
    <Box>
      <Autocomplete
        value={selectedTicker}
        onChange={(event, newValue) => setSelectedTicker(newValue)}
        options={tickers}
        getOptionLabel={(option) => option}
        sx={{ mb: 4 }}
        renderInput={(params) => <TextField {...params} label="Select Stock" variant="outlined" />}
      />
      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Indicators" value="Indicators" />
        <Tab label="Balance Sheet" value="BalanceSheet" />
        <Tab label="Annual Results" value="AnnualResults" />
        <Tab label="Tri Results" value="TriResults" />
        <Tab label="Cash Flow" value="CashFlow" />
      </Tabs>
      <StyledTableContainer>
        <StyledTable size="small" aria-label={`${activeTab} table`}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Conta</StyledTableCell>
              {columns.map((column) => (
                <StyledTableCell key={column}>{column}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <StyledTableRow key={index}>
                <TableCell>{row.Conta}</TableCell>
                {columns.map((column) => (
                  <TableCell key={column} align="center">{row[column]}</TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </Box>
  );
};

export default StatmentsTable;