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

const TableCellStyled = styled(TableCell)(({ theme, isLowVol }) => ({
  padding: "4px 8px",
  fontSize: "0.8rem",
  ...(isLowVol && {
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
    boxShadow: '0 0 10px rgba(0, 0, 255, 0.5)',
    transition: 'background-color 0.3s, box-shadow 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 255, 0.2)',
      boxShadow: '0 0 15px rgba(0, 0, 255, 0.7)',
    },
  }),
}));


const lowvolList_1d = [
  {
    ticker: "AMOB3",
    vol_key: "low",
    quartile_1: 0.8556390233072833,
    quartile_3: 1.0778598392769367,
    ewma: 0.7889715297488326
  },
  {
    ticker: "TRAD3",
    vol_key: "low",
    quartile_1: 0.6311552685789638,
    quartile_3: 0.9477432233553398,
    ewma: 0.5049862624849197
  },
  {
    ticker: "GOLL4",
    vol_key: "low",
    quartile_1: 0.4896695638225066,
    quartile_3: 0.7302016080743018,
    ewma: 0.48303045726540544
  },
  {
    ticker: "CTKA4",
    vol_key: "low",
    quartile_1: 0.4925800781309558,
    quartile_3: 0.7909581212658262,
    ewma: 0.4758636094820613
  },
  {
    ticker: "BRAV3",
    vol_key: "low",
    quartile_1: 0.47008062035949355,
    quartile_3: 0.6647858989759208,
    ewma: 0.4604584686358241
  },
  {
    ticker: "POSI3",
    vol_key: "low",
    quartile_1: 0.447625782777914,
    quartile_3: 0.6372819894765659,
    ewma: 0.4182954739656289
  },
  {
    ticker: "CASH3",
    vol_key: "low",
    quartile_1: 0.4603290048126182,
    quartile_3: 0.7359735474338643,
    ewma: 0.39794416406235017
  },
  {
    ticker: "DESK3",
    vol_key: "low",
    quartile_1: 0.41253627477803617,
    quartile_3: 0.626842971198962,
    ewma: 0.3952232501393869
  },
  {
    ticker: "LIGT3",
    vol_key: "low",
    quartile_1: 0.41461163891214176,
    quartile_3: 0.6849156599472835,
    ewma: 0.39054244881131395
  },
  {
    ticker: "MNDL3",
    vol_key: "low",
    quartile_1: 0.5151264090990451,
    quartile_3: 0.8242425746237365,
    ewma: 0.3862119299872029
  },
  {
    ticker: "TECN3",
    vol_key: "low",
    quartile_1: 0.40342583792312364,
    quartile_3: 0.6742922612791707,
    ewma: 0.38096308382734156
  },
  {
    ticker: "LVTC3",
    vol_key: "low",
    quartile_1: 0.37147585157443597,
    quartile_3: 0.6090052084943567,
    ewma: 0.3571625636328234
  },
  {
    ticker: "ALPA3",
    vol_key: "low",
    quartile_1: 0.3691843843458774,
    quartile_3: 0.4995080248868252,
    ewma: 0.34911018894077606
  },
  {
    ticker: "BPAC3",
    vol_key: "low",
    quartile_1: 0.3569532896360342,
    quartile_3: 0.5190411199938472,
    ewma: 0.3478042293721306
  },
  {
    ticker: "SHOW3",
    vol_key: "low",
    quartile_1: 0.4746110004635045,
    quartile_3: 0.7182398976297723,
    ewma: 0.3465697136143779
  },
  {
    ticker: "MNPR3",
    vol_key: "low",
    quartile_1: 0.4291191617633985,
    quartile_3: 0.6851496708996068,
    ewma: 0.34375037269864833
  },
  {
    ticker: "RECV3",
    vol_key: "low",
    quartile_1: 0.3518964471628746,
    quartile_3: 0.5106813988596782,
    ewma: 0.34341710109421514
  },
  {
    ticker: "TRIS3",
    vol_key: "low",
    quartile_1: 0.3594682056582711,
    quartile_3: 0.5199233315064031,
    ewma: 0.34092127211565776
  },
  {
    ticker: "ESPA3",
    vol_key: "low",
    quartile_1: 0.39705864827225906,
    quartile_3: 0.759295842035832,
    ewma: 0.3356655317429346
  },
  {
    ticker: "MEAL3",
    vol_key: "low",
    quartile_1: 0.41848765352582296,
    quartile_3: 0.5722053239260023,
    ewma: 0.32735492974412245
  },
  {
    ticker: "BMEB3",
    vol_key: "low",
    quartile_1: 0.332369175588778,
    quartile_3: 0.5716143407324757,
    ewma: 0.3231226572636454
  },
  {
    ticker: "ETER3",
    vol_key: "low",
    quartile_1: 0.3941429207280992,
    quartile_3: 0.6980817467137014,
    ewma: 0.3182518711506787
  },
  {
    ticker: "RNEW4",
    vol_key: "low",
    quartile_1: 0.3936598737327638,
    quartile_3: 0.6249060683702237,
    ewma: 0.3172995601419044
  },
  {
    ticker: "PINE4",
    vol_key: "low",
    quartile_1: 0.3296288140538279,
    quartile_3: 0.513644145225162,
    ewma: 0.3166993311500888
  },
  {
    ticker: "LUPA3",
    vol_key: "low",
    quartile_1: 0.45600570103166077,
    quartile_3: 0.8562191788745247,
    ewma: 0.3139762216116096
  },
  {
    ticker: "EVEN3",
    vol_key: "low",
    quartile_1: 0.3379516198089954,
    quartile_3: 0.49899997900633697,
    ewma: 0.3103184916155013
  },
  {
    ticker: "EALT3",
    vol_key: "low",
    quartile_1: 0.3508239865639586,
    quartile_3: 0.5938308590952398,
    ewma: 0.3057167291359471
  },
  {
    ticker: "DXCO3",
    vol_key: "low",
    quartile_1: 0.3508409740747575,
    quartile_3: 0.46292689239314255,
    ewma: 0.3048043439676499
  }
];




const lowvolList_1w = [
  {
    ticker: "AMOB3",
    vol_key: "low",
    quartile_1: 0.8556390233072833,
    quartile_3: 1.0778598392769367,
    ewma: 0.7889715297488326
  },
  {
    ticker: "TRAD3",
    vol_key: "low",
    quartile_1: 0.6311552685789638,
    quartile_3: 0.9477432233553398,
    ewma: 0.5049862624849197
  },
  {
    ticker: "GOLL4",
    vol_key: "low",
    quartile_1: 0.4896695638225066,
    quartile_3: 0.7302016080743018,
    ewma: 0.48303045726540544
  },
  {
    ticker: "CTKA4",
    vol_key: "low",
    quartile_1: 0.4925800781309558,
    quartile_3: 0.7909581212658262,
    ewma: 0.4758636094820613
  },
  {
    ticker: "BRAV3",
    vol_key: "low",
    quartile_1: 0.47008062035949355,
    quartile_3: 0.6647858989759208,
    ewma: 0.4604584686358241
  },
  {
    ticker: "POSI3",
    vol_key: "low",
    quartile_1: 0.447625782777914,
    quartile_3: 0.6372819894765659,
    ewma: 0.4182954739656289
  },
  {
    ticker: "CASH3",
    vol_key: "low",
    quartile_1: 0.4603290048126182,
    quartile_3: 0.7359735474338643,
    ewma: 0.39794416406235017
  },
  {
    ticker: "DESK3",
    vol_key: "low",
    quartile_1: 0.41253627477803617,
    quartile_3: 0.626842971198962,
    ewma: 0.3952232501393869
  },
  {
    ticker: "LIGT3",
    vol_key: "low",
    quartile_1: 0.41461163891214176,
    quartile_3: 0.6849156599472835,
    ewma: 0.39054244881131395
  },
  {
    ticker: "MNDL3",
    vol_key: "low",
    quartile_1: 0.5151264090990451,
    quartile_3: 0.8242425746237365,
    ewma: 0.3862119299872029
  },
  {
    ticker: "TECN3",
    vol_key: "low",
    quartile_1: 0.40342583792312364,
    quartile_3: 0.6742922612791707,
    ewma: 0.38096308382734156
  },
  {
    ticker: "LVTC3",
    vol_key: "low",
    quartile_1: 0.37147585157443597,
    quartile_3: 0.6090052084943567,
    ewma: 0.3571625636328234
  },
  {
    ticker: "ALPA3",
    vol_key: "low",
    quartile_1: 0.3691843843458774,
    quartile_3: 0.4995080248868252,
    ewma: 0.34911018894077606
  },
  {
    ticker: "BPAC3",
    vol_key: "low",
    quartile_1: 0.3569532896360342,
    quartile_3: 0.5190411199938472,
    ewma: 0.3478042293721306
  },
  {
    ticker: "SHOW3",
    vol_key: "low",
    quartile_1: 0.4746110004635045,
    quartile_3: 0.7182398976297723,
    ewma: 0.3465697136143779
  },
  {
    ticker: "MNPR3",
    vol_key: "low",
    quartile_1: 0.4291191617633985,
    quartile_3: 0.6851496708996068,
    ewma: 0.34375037269864833
  },
  {
    ticker: "RECV3",
    vol_key: "low",
    quartile_1: 0.3518964471628746,
    quartile_3: 0.5106813988596782,
    ewma: 0.34341710109421514
  },
  {
    ticker: "TRIS3",
    vol_key: "low",
    quartile_1: 0.3594682056582711,
    quartile_3: 0.5199233315064031,
    ewma: 0.34092127211565776
  },
  {
    ticker: "ESPA3",
    vol_key: "low",
    quartile_1: 0.39705864827225906,
    quartile_3: 0.759295842035832,
    ewma: 0.3356655317429346
  },
  {
    ticker: "MEAL3",
    vol_key: "low",
    quartile_1: 0.41848765352582296,
    quartile_3: 0.5722053239260023,
    ewma: 0.32735492974412245
  },
  {
    ticker: "BMEB3",
    vol_key: "low",
    quartile_1: 0.332369175588778,
    quartile_3: 0.5716143407324757,
    ewma: 0.3231226572636454
  },
  {
    ticker: "ETER3",
    vol_key: "low",
    quartile_1: 0.3941429207280992,
    quartile_3: 0.6980817467137014,
    ewma: 0.3182518711506787
  },
  {
    ticker: "RNEW4",
    vol_key: "low",
    quartile_1: 0.3936598737327638,
    quartile_3: 0.6249060683702237,
    ewma: 0.3172995601419044
  },
  {
    ticker: "PINE4",
    vol_key: "low",
    quartile_1: 0.3296288140538279,
    quartile_3: 0.513644145225162,
    ewma: 0.3166993311500888
  },
  {
    ticker: "LUPA3",
    vol_key: "low",
    quartile_1: 0.45600570103166077,
    quartile_3: 0.8562191788745247,
    ewma: 0.3139762216116096
  },
  {
    ticker: "EVEN3",
    vol_key: "low",
    quartile_1: 0.3379516198089954,
    quartile_3: 0.49899997900633697,
    ewma: 0.3103184916155013
  },
  {
    ticker: "EALT3",
    vol_key: "low",
    quartile_1: 0.3508239865639586,
    quartile_3: 0.5938308590952398,
    ewma: 0.3057167291359471
  },
  {
    ticker: "DXCO3",
    vol_key: "low",
    quartile_1: 0.3508409740747575,
    quartile_3: 0.46292689239314255,
    ewma: 0.3048043439676499
  }
];



export default function LowVol() {
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
    <Box width="100%" overflow="auto" display="flex" flexDirection="column" gap={4} alignItems="right">
      <Paper elevation={2} sx={{ padding: 2, width: "100%", maxWidth: "800px" }}>
        <h3>Low Volatility - Weekly</h3>
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
            {lowvolList_1w.slice(page1w * rowsPerPage, page1w * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableRow key={`1w-${index}`}>
                <TableCellStyled align="left">{item.ticker}</TableCellStyled>
                <TableCellStyled align="center" isLowVol={item.vol_key === 'low'}>{item.vol_key}</TableCellStyled>
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
          count={lowvolList_1w.length}
          onPageChange={handleChangePage1w}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{ "aria-label": "Next Page" }}
          backIconButtonProps={{ "aria-label": "Previous Page" }}
        />
      </Paper>

      <Paper elevation={2} sx={{ padding: 1, width: "100%", maxWidth: "800px" }}>
        <h3>Low Volatility - Daily</h3>
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
            {lowvolList_1d.slice(page1d * rowsPerPage, page1d * rowsPerPage + rowsPerPage).map((item, index) => (
              <TableRow key={`1d-${index}`}>
                <TableCellStyled align="left">{item.ticker}</TableCellStyled>
                <TableCellStyled align="center" isLowVol={item.vol_key === 'low'}>{item.vol_key}</TableCellStyled>
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
          count={lowvolList_1d.length}
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