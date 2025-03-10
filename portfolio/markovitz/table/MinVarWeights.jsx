import React from 'react';
import {
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Paper
} from "@mui/material";

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& thead": {
    "& tr": { 
      "& th": { 
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
      } 
    }
  },
  "& tbody": {
    "& tr": { 
      "& td": { 
        paddingLeft: 8,
        paddingRight: 8,
        textTransform: "capitalize" 
      } 
    }
  }
}));

export default function MinVarWeights({ data }) {
  const weights = data?.weights || {};

  const weightsList = Object.entries(weights).map(([asset, weight]) => ({
    name: asset,
    peso: `${(weight * 100).toFixed(2)}%`
  }));

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 150, mx: 'auto' }}>
      <StyledTable size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">Ativo</TableCell>
            <TableCell align="center">Peso</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {weightsList.map((asset, index) => (
            <TableRow key={index}>
              <TableCell align="center">{asset.name}</TableCell>
              <TableCell align="center">{asset.peso}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}