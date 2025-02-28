import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
  Typography,
  Button,
  styled
} from "@mui/material";
import { fetchCointegrationView, fetchIBOVendpoint } from "/src/__api__/db/apiService";

const StyledTableContainer = styled(TableContainer)({
  maxHeight: "300px",
  overflowY: "auto",
});

const StyledTable = styled(Table)({
  minWidth: "50%",
  borderCollapse: "collapse",
  "& .MuiTableCell-root": {
    padding: "4px",
    fontSize: "0.75rem",
    textAlign: "center",
  },
});

const StyledTableCell = styled(TableCell)(({ theme, cointegrated }) => ({
  fontWeight: "bold",
  backgroundColor: cointegrated ? "#4CAF50" : theme.palette.background.paper,
  color: cointegrated ? "#fff" : theme.palette.text.primary,
  padding: "4px",
  fontSize: "0.75rem",
  textAlign: "center",
  cursor: "pointer",
  boxShadow: cointegrated ? "0px 0px 3px 1px rgba(76, 175, 80, 0.5)" : "none",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: cointegrated ? "#66BB6A" : theme.palette.action.hover,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const LongShortTable = () => {
  const [symbols, setSymbols] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState("last_6_months");
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [symbolResponse, cointegrationResponse] = await Promise.all([
          fetchIBOVendpoint(),
          fetchCointegrationView()
        ]);
        
        const symbolList = symbolResponse.map(({ symbol }) => symbol);
        setSymbols(symbolList);
        setData(cointegrationResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  if (!data || !data[timeFrame] || symbols.length === 0) return <Typography>No data available</Typography>;

  const results = data[timeFrame].results;

  return (
    <Box>
      <Box display="flex" justifyContent="center" mb={2}>
        <Button
          variant={timeFrame === "last_6_months" ? "contained" : "outlined"}
          onClick={() => setTimeFrame("last_6_months")}
        >
          Last 6 Months
        </Button>
        <Button
          variant={timeFrame === "last_12_months" ? "contained" : "outlined"}
          onClick={() => setTimeFrame("last_12_months")}
          sx={{ ml: 2 }}
        >
          Last 12 Months
        </Button>
      </Box>
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              {symbols.map((symbol) => (
                <StyledTableCell key={symbol}>{symbol}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {symbols.map((symbol1) => (
              <StyledTableRow key={symbol1}>
                <StyledTableCell>{symbol1}</StyledTableCell>
                {symbols.map((symbol2) => {
                  if (symbol1 === symbol2) return <TableCell key={symbol2}>-</TableCell>;
                  const pair = results.find(
                    (r) => (r.asset1 === symbol1 && r.asset2 === symbol2) || (r.asset1 === symbol2 && r.asset2 === symbol1)
                  );
                  return (
                    <StyledTableCell
                      key={symbol2}
                      cointegrated={pair?.cointegrated}
                      title={pair?.cointegrated ? "Cointegrated!" : `p-value: ${pair?.p_value.toFixed(4)}`}
                    >
                      {pair ? pair.p_value.toFixed(4) : "N/A"}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </Box>
  );
};

export default LongShortTable;
