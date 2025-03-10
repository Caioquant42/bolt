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
  TableSortLabel
} from "@mui/material";
import { fetchSurvivalAnalysis } from "/src/__api__/db/apiService";

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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const SurvivalTable = () => {
  const [survivalData, setSurvivalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThreshold, setSelectedThreshold] = useState('-0.03');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('current_cumulative_hazard');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSurvivalAnalysis();
        setSurvivalData(data);
        setLoading(false);
      } catch (error) {
        console.error("Falha ao buscar dados de sobrevivência:", error);
        setError("Falha ao carregar dados. Por favor, tente novamente mais tarde.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  if (error) {
    return <Box color="error.main">{error}</Box>;
  }

  const formatValue = (value, decimals = 2) => {
    if (value === undefined || isNaN(value)) return 'N/A';
    return Number(value).toFixed(decimals);
  };

  const handleThresholdChange = (event) => {
    setSelectedThreshold(event.target.value);
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const createSortHandler = (property) => () => {
    handleRequestSort(property);
  };

  const sortedData = Object.entries(survivalData)
    .filter(([_, data]) => !isNaN(data[selectedThreshold]?.current_cumulative_hazard))
    .map(([ticker, data]) => ({ ticker, ...data[selectedThreshold] }));

  const paginatedData = stableSort(sortedData, getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const headCells = [
    { id: 'ticker', label: 'Ticker', tooltip: '' },
    { id: 'days_since_last_incident', label: 'Dias', tooltip: 'Dias desde o último incidente significativo' },
    { id: 'tail_index', label: 'Índ. Cauda', tooltip: 'Índice de cauda estimado da distribuição' },
    { id: 'current_survival_probability', label: 'Prob. Sobrev.', tooltip: 'Probabilidade de não experimentar uma queda significativa no futuro próximo' },
    { id: 'current_hazard_rate', label: 'Taxa Risco', tooltip: 'Taxa atual de experimentar uma queda significativa' },
    { id: 'current_cumulative_hazard', label: 'Risco Acum.', tooltip: 'Risco acumulado de experimentar uma queda significativa' },
  ];

  return (
    <Box>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Selecione o Limite</FormLabel>
        <RadioGroup
          row
          aria-label="threshold"
          name="threshold"
          value={selectedThreshold}
          onChange={handleThresholdChange}
        >
          <FormControlLabel value="-0.03" control={<Radio />} label="-3%" />
          <FormControlLabel value="-0.05" control={<Radio />} label="-5%" />
          <FormControlLabel value="-0.07" control={<Radio />} label="-7%" />
        </RadioGroup>
      </FormControl>

      <StyledTableContainer>
        <StyledTable size="small" aria-label="tabela de análise de sobrevivência">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <StyledTableCell
                  key={headCell.id}
                  align={headCell.id !== 'ticker' ? 'right' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    <Tooltip title={headCell.tooltip}>
                      <span>{headCell.label}</span>
                    </Tooltip>
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((data) => (
              <StyledTableRow key={data.ticker}>
                <TableCell>{data.ticker}</TableCell>
                <TableCell align="right">{data.days_since_last_incident || 'N/A'}</TableCell>
                <TableCell align="right">{formatValue(data.tail_index, 4)}</TableCell>
                <TableCell align="right">
                  {formatValue(data.current_survival_probability * 100, 1)}%
                </TableCell>
                <TableCell align="right">
                  {formatValue(data.current_hazard_rate * 100, 1)}%
                </TableCell>
                <TableCell align="right">
                  {formatValue(data.current_cumulative_hazard, 4)}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </Box>
  );
};

export default SurvivalTable;