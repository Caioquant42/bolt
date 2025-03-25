import React from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import CollarTable from './CollarTable'; // Make sure this path is correct

const CollarPage = () => {
  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Zomma Strategy Options
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Market Overview
          </Typography>
          <Typography variant="body1" paragraph>
            This page displays the top 20 collar strategy options for different time frames. 
            Click on a row to see the associated put options for each call.
          </Typography>
          <CollarTable />
        </Paper>
      </Box>
    </Container>
  );
};

export default CollarPage;