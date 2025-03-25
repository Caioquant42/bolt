import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  Tooltip,
  TextField,
  TableSortLabel
} from "@mui/material";
import { fetchBRRecommendations } from "/src/__api__/db/apiService";

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

export default function AllTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [subscribers, setSubscribers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('ticker');

  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await fetchBRRecommendations();
      const filteredData = data.filter(subscriber => subscriber.recommendationKey && subscriber.recommendationKey.toLowerCase() !== 'none');
      setSubscribers(filteredData || []);
      setFiltered(filteredData || []);
    };
    loadRecommendations();
  }, []);

  useEffect(() => {
    const filteredData = subscribers
      .filter(subscriber => subscriber.ticker.toLowerCase().includes(filterValue.toLowerCase()));
    setFiltered(filteredData);
    setPage(0);
  }, [filterValue, subscribers]);

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

  return (
    <Box width="100%">
      <TextField
        fullWidth
        variant="outlined"
        label="Buscar Ativo"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        margin="normal"
      />
      <StyledTableContainer>
        <StyledTable size="small" aria-label="all recommendations table">
          <TableHead>
            <TableRow>
              {[
                { id: 'ticker', label: 'Ticker' },
                { id: 'numberOfAnalystOpinions', label: 'Analistas', numeric: true },
                { id: 'currentPrice', label: 'Preço', numeric: true },
                { id: 'recommendationKey', label: 'Recomendação' },
                { id: 'targetLowPrice', label: 'Alvo Mín', numeric: true },
                { id: '% Distance to Low', label: 'Retorno Mín', numeric: true },
                { id: 'targetMedianPrice', label: 'Alvo Médio', numeric: true },
                { id: '% Distance to Median', label: 'Retorno Médio', numeric: true },
                { id: 'targetHighPrice', label: 'Alvo Máx', numeric: true },
                { id: '% Distance to High', label: 'Retorno Máx', numeric: true },
              ].map((headCell) => (
                <StyledTableCell
                  key={headCell.id}
                  align={headCell.numeric ? 'center' : 'left'}
                  sortDirection={orderBy === headCell.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : 'asc'}
                    onClick={createSortHandler(headCell.id)}
                  >
                    <Tooltip title={headCell.label}>
                      <span>{headCell.label}</span>
                    </Tooltip>
                  </TableSortLabel>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(filtered, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((subscriber, index) => (
                <StyledTableRow key={index}>
                  <TableCell>{subscriber.ticker}</TableCell>
                  <TableCell align="center">{subscriber.numberOfAnalystOpinions}</TableCell>
                  <TableCell align="center">R${parseFloat(subscriber.currentPrice).toFixed(2)}</TableCell>
                  <TableCell align="center">{subscriber.recommendationKey}</TableCell>
                  <TableCell align="center">R${parseFloat(subscriber.targetLowPrice).toFixed(2)}</TableCell>
                  <TableCell align="center">{subscriber['% Distance to Low'].toFixed(1)}%</TableCell>
                  <TableCell align="center">R${parseFloat(subscriber.targetMedianPrice).toFixed(2)}</TableCell>
                  <TableCell align="center">{subscriber['% Distance to Median'].toFixed(1)}%</TableCell>
                  <TableCell align="center">R${parseFloat(subscriber.targetHighPrice).toFixed(2)}</TableCell>
                  <TableCell align="center">{subscriber['% Distance to High'].toFixed(1)}%</TableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={filtered.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
}