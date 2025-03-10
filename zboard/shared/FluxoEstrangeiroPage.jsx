import React from 'react';
import { Card, Typography, Box, useTheme, useMediaQuery, Grid } from '@mui/material';
import FluxoEstrangeiro from './echarts/FluxoEstrangeiro';

const FluxoEstrangeiroPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ width: '100%', p: isMobile ? 1 : 2 }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h1" 
        gutterBottom
        sx={{
          fontSize: isMobile ? '1.5rem' : '2rem',
          mb: isMobile ? 1 : 2
        }}
      >
        Fluxo Estrangeiro
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card 
            sx={{
              height: '100%',
              overflow: 'hidden',
              '& > div > div': {
                height: isMobile ? '300px !important' : '400px !important'
              }
            }}
          >
            <FluxoEstrangeiro />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FluxoEstrangeiroPage;