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
  Tooltip,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  TablePagination,
  TableSortLabel,
  Collapse,
  IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { fetchCOLLAR14View, fetchCOLLAR30View, fetchCOLLAR60View, fetchCOLLARABOVE60View } from "/src/__api__/db/apiService";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: '6px 8px',
  fontSize: '0.75rem',
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

const GlowingStyledTableRow = styled(StyledTableRow)(({ theme, isHighest }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(isHighest && {
    animation: `$glowing 1.5s infinite alternate`,
    backgroundColor: 'rgba(128, 0, 128, 0.1)', // Light purple background
  }),
  '@keyframes glowing': {
    '0%': { boxShadow: '0 0 5px #800080' },
    '100%': { boxShadow: '0 0 20px #800080' },
  },
}));
const OptionsTable = () => {
  const [data14, setData14] = useState([]);
  const [data30, setData30] = useState([]);
  const [data60, setData60] = useState([]);
  const [dataAbove60, setDataAbove60] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [result14, result30, result60, resultAbove60] = await Promise.all([
          fetchCOLLAR14View(),
          fetchCOLLAR30View(),
          fetchCOLLAR60View(),
          fetchCOLLARABOVE60View(),
        ]);
        setData14(result14.slice(0, 20));
        setData30(result30.slice(0, 20));
        setData60(result60.slice(0, 20));
        setDataAbove60(resultAbove60.slice(0, 20));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleExpandRow = (symbol) => {
    setExpandedRows((prev) => ({ ...prev, [symbol]: !prev[symbol] }));
  };

  const findHighestGainToRiskRatio = (data) => {
    let highestRatio = -Infinity;
    let highestSymbol = null;

    data.forEach(call => {
      call.puts.forEach(put => {
        if (put.gain_to_risk_ratio > highestRatio) {
          highestRatio = put.gain_to_risk_ratio;
          highestSymbol = call.symbol;
        }
      });
    });

    return highestSymbol;
  };

  const GlowingStyledTableRow = styled(StyledTableRow)(({ theme, isHighest }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    ...(isHighest && {
      animation: `$glowing 1.5s infinite alternate`,
      backgroundColor: 'rgba(128, 0, 128, 0.1)', // Light purple background
    }),
    '@keyframes glowing': {
      '0%': { boxShadow: '0 0 5px #800080' },
      '100%': { boxShadow: '0 0 20px #800080' },
    },
  }));

  const renderCallRow = (call) => {
    // Find the put with the highest gain_to_risk_ratio for this specific call
    let highestPut = null;
    let highestRatio = -Infinity;

    call.puts.forEach(put => {
      if (put.gain_to_risk_ratio > highestRatio) {
        highestRatio = put.gain_to_risk_ratio;
        highestPut = put;
      }
    });

    return (
      <React.Fragment key={call.symbol}>
        <StyledTableRow>
          <TableCell>
            <IconButton size="small" onClick={() => handleExpandRow(call.symbol)}>
              {expandedRows[call.symbol] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>          
          <TableCell>{call.parent_symbol}</TableCell>
          <TableCell>{call.symbol}</TableCell>
          <TableCell>{call.strike?.toFixed(2) ?? 'N/A'}</TableCell>
          <TableCell>{call.category}</TableCell>
          <TableCell>{call.due_date}</TableCell>
          <TableCell>{call.days_to_maturity}</TableCell>
          <TableCell>{call.spot_price}</TableCell>
          <TableCell>{call.close?.toFixed(2) ?? 'N/A'}</TableCell>
          <TableCell>{call.bid?.toFixed(2) ?? 'N/A'}</TableCell>
          <TableCell>{call.ask?.toFixed(2) ?? 'N/A'}</TableCell>
          <TableCell>{call.bid_volume ?? 'N/A'}</TableCell>
          <TableCell>{call.ask_volume ?? 'N/A'}</TableCell>
          <TableCell>{call.intrinsic_value?.toFixed(2) ?? 'N/A'}</TableCell>
          <TableCell>{call.extrinsic_value?.toFixed(2) ?? 'N/A'}</TableCell>
          <TableCell>{call.pm?.toFixed(2) ?? 'N/A'}</TableCell>
          <TableCell>{(call.protection * 100).toFixed(2)}%</TableCell>
          <TableCell>{(call.embedded_interest * 100).toFixed(2)}%</TableCell>
          <TableCell>{(call.annual_return * 100).toFixed(2)}%</TableCell>
        </StyledTableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={16}>
            <Collapse in={expandedRows[call.symbol]} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Opção</StyledTableCell>
                      <StyledTableCell>Strike</StyledTableCell>
                      <StyledTableCell>Close</StyledTableCell>
                      <StyledTableCell>Bid</StyledTableCell>
                      <StyledTableCell>Ask</StyledTableCell>
                      <StyledTableCell>Bid Volume</StyledTableCell>
                      <StyledTableCell>Ask Volume</StyledTableCell>
                      <StyledTableCell>VE</StyledTableCell>
                      <StyledTableCell>Taxa</StyledTableCell>
                      <StyledTableCell>Retorno Anual</StyledTableCell>
                      <StyledTableCell>PM Final</StyledTableCell>
                      <StyledTableCell>Ganho(R$)</StyledTableCell>
                      <StyledTableCell>Risco(R$)</StyledTableCell>
                      <StyledTableCell>G/R</StyledTableCell>
                      <StyledTableCell>spot_to_call_strike</StyledTableCell>
                      <StyledTableCell>spot_to_put_strike</StyledTableCell>
                      <StyledTableCell>spot_to_pm</StyledTableCell>
                      <StyledTableCell>BE</StyledTableCell>
                      <StyledTableCell>pm_to_profit</StyledTableCell>
                      <StyledTableCell>pm_to_loss</StyledTableCell>
                      <StyledTableCell>score</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {call.puts.map((put) => (
                      <GlowingStyledTableRow 
                        key={put.symbol} 
                        isHighest={put === highestPut} // Check if this put is the highest for its parent call
                      >
                        <TableCell>{put.symbol}</TableCell>
                        <TableCell>{put.strike?.toFixed(2) ?? 'N/A'}</TableCell>
                        <TableCell>{put.close?.toFixed(2) ?? 'N/A'}</TableCell>
                        <TableCell>{put.bid?.toFixed(2) ?? 'N/A'}</TableCell>
                        <TableCell>{put.ask?.toFixed(2) ?? 'N/A'}</TableCell>
                        <TableCell>{put.bid_volume ?? 'N/A'}</TableCell>
                        <TableCell>{put.ask_volume ?? 'N/A'}</TableCell>
                        <TableCell>{put.extrinsic_value_result?.toFixed(4) ?? 'N/A'}</TableCell>
                        <TableCell>{(put.embedded_interest_result * 100).toFixed(2)}%</TableCell>
                        <TableCell>{(put.annual_return_result * 100).toFixed(2)}%</TableCell>
                        <TableCell>{put.pm_result?.toFixed(2) ?? 'N/A'}</TableCell>
                        <TableCell>{put.total_gain?.toFixed(2) ?? 'N/A'}</TableCell>
                        <TableCell>{put.total_risk?.toFixed(2) ?? 'N/A'}</TableCell>
                        <TableCell>{put.gain_to_risk_ratio?.toFixed(4) ?? 'no risk'}</TableCell>
                        <TableCell>{(put.spot_variation_to_max_return * 100).toFixed(2)}%</TableCell>
                        <TableCell>{(put.spot_variation_to_stoploss * 100).toFixed(2)}%</TableCell>
                        <TableCell>{(put.spot_variation_to_pm_result * 100).toFixed(2)}%</TableCell>
                        <TableCell>{((1 + put.spot_variation_to_pm_result) * call.spot_price).toFixed(2)}</TableCell>
                        <TableCell>{(put.pm_distance_to_profit * 100).toFixed(2)}%</TableCell>
                        <TableCell>{(put.pm_distance_to_loss * 100).toFixed(2)}%</TableCell>
                        <TableCell>{put.combined_score?.toFixed(4) ?? 'N/A'}</TableCell>
                      </GlowingStyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };
  const renderTable = (data, title) => (
    <Box mb={4}>
      <h2>{title}</h2>
      <StyledTableContainer>
        <StyledTable>
          <TableHead>
            <TableRow>
              <StyledTableCell />
              <StyledTableCell>Ativo</StyledTableCell>
              <StyledTableCell>Opção</StyledTableCell>              
              <StyledTableCell>Strike</StyledTableCell>
              <StyledTableCell>Tipo</StyledTableCell>
              <StyledTableCell>Venc.</StyledTableCell>
              <StyledTableCell>Dias até Venc.</StyledTableCell>
              <StyledTableCell>À vista</StyledTableCell>              
              <StyledTableCell>Close</StyledTableCell>
              <StyledTableCell>Bid</StyledTableCell>
              <StyledTableCell>Ask</StyledTableCell>
              <StyledTableCell>Bid Volume</StyledTableCell>
              <StyledTableCell>Ask Volume</StyledTableCell>
              <StyledTableCell>VI</StyledTableCell>
              <StyledTableCell>VE</StyledTableCell>
              <StyledTableCell>PM</StyledTableCell>
              <StyledTableCell>Defesa</StyledTableCell>
              <StyledTableCell>Taxa</StyledTableCell>
              <StyledTableCell>Retorno Anual</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((call) => renderCallRow(call))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </Box>
  );

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      {renderTable(data14, "Options <= 14 days")}
      {renderTable(data30, "Options 15-30 days")}
      {renderTable(data60, "Options 31-60 days")}
      {renderTable(dataAbove60, "Options > 60 days")}
    </Box>
  );
};

export default OptionsTable;