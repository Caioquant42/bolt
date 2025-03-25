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
  Button,
  TableSortLabel
} from "@mui/material";
import { fetchCointegrationView, fetchIBOVendpoint } from "/src/__api__/db/apiService";

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
  marginBottom: '20px',
});

const StyledTable = styled(Table)({
  minWidth: 'auto',
  "& .MuiTableCell-root": {
    padding: '4px 8px',
    fontSize: '0.7rem',
  },
});

const TimeFrameButton = styled(Button)(({ theme, selected }) => ({
  margin: '0 8px',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? theme.palette.common.white : theme.palette.primary.main,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

const LongShortTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("last_6_months");
  const [sortConfig, setSortConfig] = useState({ key: 'p_value', direction: 'ascending' });
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const cointegrationResponse = await fetchCointegrationView();
        setData(cointegrationResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (!data || !data[timeFrame]) return <Typography>No data available</Typography>;

  // Filter only cointegrated assets and sort them
  const cointegratedAssets = data[timeFrame].results
    .filter(item => item.cointegrated)
    .sort((a, b) => {
      if (sortConfig.key === 'p_value') {
        return sortConfig.direction === 'ascending' 
          ? a.p_value - b.p_value 
          : b.p_value - a.p_value;
      } else if (sortConfig.key === 'asset1') {
        return sortConfig.direction === 'ascending'
          ? a.asset1.localeCompare(b.asset1)
          : b.asset1.localeCompare(a.asset1);
      } else if (sortConfig.key === 'asset2') {
        return sortConfig.direction === 'ascending'
          ? a.asset2.localeCompare(b.asset2)
          : b.asset2.localeCompare(a.asset2);
      }
      return 0;
    });

  return (
    <Box>
      <Box display="flex" justifyContent="center" mb={3} mt={2}>
        <TimeFrameButton
          variant="contained"
          selected={timeFrame === "last_6_months"}
          onClick={() => setTimeFrame("last_6_months")}
          size="small"
        >
          Last 6 Months
        </TimeFrameButton>
        <TimeFrameButton
          variant="contained"
          selected={timeFrame === "last_12_months"}
          onClick={() => setTimeFrame("last_12_months")}
          size="small"
        >
          Last 12 Months
        </TimeFrameButton>
      </Box>
      
      <Typography variant="h6" gutterBottom>
        Cointegrated Assets - {timeFrame === "last_6_months" ? "Last 6 Months" : "Last 12 Months"}
      </Typography>
      
      <StyledTableContainer>
        <StyledTable size="small" aria-label="tabela de ativos cointegrados">
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === 'asset1'}
                  direction={sortConfig.key === 'asset1' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('asset1')}
                >
                  Asset 1
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell>
                <TableSortLabel
                  active={sortConfig.key === 'asset2'}
                  direction={sortConfig.key === 'asset2' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('asset2')}
                >
                  Asset 2
                </TableSortLabel>
              </StyledTableCell>
              <StyledTableCell align="center">
                <TableSortLabel
                  active={sortConfig.key === 'p_value'}
                  direction={sortConfig.key === 'p_value' ? sortConfig.direction : 'asc'}
                  onClick={() => requestSort('p_value')}
                >
                  p-value
                </TableSortLabel>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cointegratedAssets.length > 0 ? (
              cointegratedAssets.map((item, index) => (
                <StyledTableRow key={index}>
                  <TableCell align="center">{item.asset1}</TableCell>
                  <TableCell align="center">{item.asset2}</TableCell>
                  <TableCell align="center">{item.p_value.toFixed(4)}</TableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <TableCell colSpan={3} align="center">No cointegrated assets found</TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </Box>
  );
};

export default LongShortTable;