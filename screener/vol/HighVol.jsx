import React, { useState } from "react";
import { Box, Table, TableBody, TableCell, TableHead, TableRow, TablePagination, styled, Paper } from "@mui/material";

// STYLED COMPONENTS
const StyledTable = styled(Table)(() => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { "& th": { paddingLeft: 0, paddingRight: 0, fontSize: "0.9rem" } }
  },
  "& tbody": {
    "& tr": { "& td": { paddingLeft: 0, textTransform: "capitalize", fontSize: "0.8rem" } }
  }
}));

const TableCellStyled = styled(TableCell)(({ theme, isHighVol }) => ({
  padding: "4px 8px",
  fontSize: "0.8rem",
  ...(isHighVol && {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.2)',
      boxShadow: '0 0 15px rgba(255, 0, 0, 0.7)',
    },
  }),
}));

const highvolList_1d = [
  {
    ticker: "AGXY3",
    vol_key: "high",
    quartile_1: 0.4139936778380332,
    quartile_3: 0.7086034204783295,
    ewma: 2.0688564989830964
  },
  {
    ticker: "IFCM3",
    vol_key: "high",
    quartile_1: 0.5910016325709367,
    quartile_3: 1.0728555108404467,
    ewma: 1.771866796199036
  },
  {
    ticker: "AZEV3",
    vol_key: "high",
    quartile_1: 0.5360289280150798,
    quartile_3: 0.8138930520867256,
    ewma: 1.6697069004411036
  },
  {
    ticker: "AZEV4",
    vol_key: "high",
    quartile_1: 0.6049802512495102,
    quartile_3: 0.8829300018625881,
    ewma: 1.65059232838003
  },
  {
    ticker: "CGAS3",
    vol_key: "high",
    quartile_1: 0.2581059896866774,
    quartile_3: 0.44155296438728775,
    ewma: 1.3054720419906307
  },
  {
    ticker: "PMAM3",
    vol_key: "high",
    quartile_1: 0.3511937955948537,
    quartile_3: 0.615382505721275,
    ewma: 1.2995748634675308
  },
  {
    ticker: "AERI3",
    vol_key: "high",
    quartile_1: 0.4654167591114833,
    quartile_3: 0.7791919774168483,
    ewma: 1.1827364665635622
  },
  {
    ticker: "GFSA3",
    vol_key: "high",
    quartile_1: 0.5334332827415631,
    quartile_3: 0.842712930450231,
    ewma: 1.0269794561496153
  },
  {
    ticker: "SNSY5",
    vol_key: "high",
    quartile_1: 0.417800472486674,
    quartile_3: 0.694503369839855,
    ewma: 1.004713305526141
  }
];


const highvolList_1w = [
  {
    ticker: "AGXY3",
    vol_key: "high",
    quartile_1: 0.4139936778380332,
    quartile_3: 0.7086034204783295,
    ewma: 2.0688564989830964
  },
  {
    ticker: "IFCM3",
    vol_key: "high",
    quartile_1: 0.5910016325709367,
    quartile_3: 1.0728555108404467,
    ewma: 1.771866796199036
  },
  {
    ticker: "AZEV3",
    vol_key: "high",
    quartile_1: 0.5360289280150798,
    quartile_3: 0.8138930520867256,
    ewma: 1.6697069004411036
  },
  {
    ticker: "AZEV4",
    vol_key: "high",
    quartile_1: 0.6049802512495102,
    quartile_3: 0.8829300018625881,
    ewma: 1.65059232838003
  },
  {
    ticker: "CGAS3",
    vol_key: "high",
    quartile_1: 0.2581059896866774,
    quartile_3: 0.44155296438728775,
    ewma: 1.3054720419906307
  },
  {
    ticker: "PMAM3",
    vol_key: "high",
    quartile_1: 0.3511937955948537,
    quartile_3: 0.615382505721275,
    ewma: 1.2995748634675308
  },
  {
    ticker: "AERI3",
    vol_key: "high",
    quartile_1: 0.4654167591114833,
    quartile_3: 0.7791919774168483,
    ewma: 1.1827364665635622
  },
  {
    ticker: "GFSA3",
    vol_key: "high",
    quartile_1: 0.5334332827415631,
    quartile_3: 0.842712930450231,
    ewma: 1.0269794561496153
  },
  {
    ticker: "SNSY5",
    vol_key: "high",
    quartile_1: 0.417800472486674,
    quartile_3: 0.694503369839855,
    ewma: 1.004713305526141
  }
];


export default function HighVol() {
  const [page1d, setPage1d] = useState(0);
  const [page1w, setPage1w] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage1d = (_, newPage) => {
    setPage1d(newPage);
  };

  const handleChangePage1w = (_, newPage) => {
    setPage1w(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage1d(0);
    setPage1w(0);
  };

  return (
    <Box width="100%" overflow="auto" display="flex" flexDirection="column" gap={4} alignItems="left">
      <Paper elevation={2} sx={{ padding: 2, width: "100%", maxWidth: "800px" }}>
        <h3>High Volatility - Weekly</h3>
        <StyledTable size="small">
          <TableHead>
            <TableRow>
              <TableCellStyled align="left">Ticker</TableCellStyled>
              <TableCellStyled align="center">Vol Key</TableCellStyled>
              <TableCellStyled align="center">1st Quartile</TableCellStyled>
              <TableCellStyled align="center">3rd Quartile</TableCellStyled>
              <TableCellStyled align="center">EWMA</TableCellStyled>
            </TableRow>
          </TableHead>
          <TableBody>
            {highvolList_1w.slice(page1w * rowsPerPage, page1w * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableRow key={`1w-${index}`}>
                <TableCellStyled align="left">{item.ticker}</TableCellStyled>
                <TableCellStyled align="center" isHighVol={item.vol_key === 'high'}>{item.vol_key}</TableCellStyled>
                <TableCellStyled align="center">{item.quartile_1.toFixed(3)}</TableCellStyled>
                <TableCellStyled align="center">{item.quartile_3.toFixed(3)}</TableCellStyled>
                <TableCellStyled align="center">{item.ewma.toFixed(3)}</TableCellStyled>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
        <TablePagination
          sx={{ px: 2 }}
          page={page1w}
          component="div"
          rowsPerPage={rowsPerPage}
          count={highvolList_1w.length}
          onPageChange={handleChangePage1w}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
        />
      </Paper>

      <Paper elevation={2} sx={{ padding: 1, width: "100%", maxWidth: "800px" }}>
        <h3>High Volatility - Daily</h3>
        <StyledTable size="small">
          <TableHead>
            <TableRow>
              <TableCellStyled align="left">Ticker</TableCellStyled>
              <TableCellStyled align="center">Vol Key</TableCellStyled>
              <TableCellStyled align="center">1st Quartile</TableCellStyled>
              <TableCellStyled align="center">3rd Quartile</TableCellStyled>
              <TableCellStyled align="center">EWMA</TableCellStyled>
            </TableRow>
          </TableHead>
          <TableBody>
            {highvolList_1d.slice(page1d * rowsPerPage, page1d * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableRow key={`1d-${index}`}>
                <TableCellStyled align="left">{item.ticker}</TableCellStyled>
                <TableCellStyled align="center" isHighVol={item.vol_key === 'high'}>{item.vol_key}</TableCellStyled>
                <TableCellStyled align="center">{item.quartile_1.toFixed(3)}</TableCellStyled>
                <TableCellStyled align="center">{item.quartile_3.toFixed(3)}</TableCellStyled>
                <TableCellStyled align="center">{item.ewma.toFixed(3)}</TableCellStyled>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
        <TablePagination
          sx={{ px: 2 }}
          page={page1d}
          component="div"
          rowsPerPage={rowsPerPage}
          count={highvolList_1d.length}
          onPageChange={handleChangePage1d}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
        />
      </Paper>
    </Box>
  );
}