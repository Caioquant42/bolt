import React, { Fragment, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import BadgeAutocompletePage from "./BadgeAutocompletePage";
import TangencyWeightsPage from "./TangencyWeightsPage";
import PerformanceAssetsPage from "./PerformanceAssetsPage";
import PerformanceIBOVPage from "./PerformanceIBOVPage";
import TangencyStatsPage from "./TangencyStatsPage";
import MinVarStatsPage from "./MinVarStatsPage";
import MinVarWeightsPage from "./MinVarWeightsPage";
import MinVarPerformanceAssetsPage from "./MinVarPerformanceAssetsPage";
import MinVarPerformanceIBOVPage from "./MinVarPerformanceIBOVPage";
import IntroductionSection from "./IntroductionSection";
import { Grid } from "@mui/material";

const Container = styled("div")(({ theme }) => ({
  maxWidth: "1500px",
  padding: "20px 1px",
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    margin: "13px",
    padding: "10px 5px",
    maxWidth: "100%",
  },
}));


export default function AppMarkovitz() {
  const [optimizationData, setOptimizationData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataReceived = (data) => {
    console.log("Data received in AppMarkovitz:", data);
    try {
      let parsedData;
      if (typeof data === 'string') {
        // Replace NaN with null before parsing
        parsedData = JSON.parse(data.replace(/:\s*NaN/g, ': null'));
      } else {
        // If it's already an object, deep clone it and replace NaN with null
        parsedData = JSON.parse(JSON.stringify(data, (key, value) =>
          value !== value ? null : value
        ));
      }
      setOptimizationData(parsedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error processing optimization data:", error);
      setIsLoading(false);
      // You might want to set an error state here and display it to the user
    }
  };
  useEffect(() => {
    console.log("optimizationData updated:", optimizationData);
  }, [optimizationData]);

  return (
    <Fragment>
      <Container>
        {/* Introduction Section */}
        <Box sx={{ width: "100%", marginBottom: 3 }}>
          <IntroductionSection />
        </Box>

        {/* Badge Autocomplete */}
        <Box sx={{ width: "100%", marginBottom: 1 }}>
          <BadgeAutocompletePage 
            onDataReceived={handleDataReceived}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Box>

        {isLoading ? (
          <CircularProgress />
        ) : (
          optimizationData && (
            <>
              {/* Second row - Tangency Portfolio */}
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={1.7}>
                  <TangencyWeightsPage data={optimizationData?.tangency_data?.weights} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <PerformanceAssetsPage data={optimizationData?.tangency_data} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <PerformanceIBOVPage data={optimizationData?.tangency_data} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TangencyStatsPage data={optimizationData?.tangency_data} />
                </Grid>
              </Grid>

              {/* Third row - Minimum Variance Portfolio */}
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={1.7}>
                  <MinVarWeightsPage data={{weights: optimizationData?.min_variance_data?.weights}} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MinVarPerformanceAssetsPage data={optimizationData?.min_variance_data} />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MinVarPerformanceIBOVPage data={optimizationData?.min_variance_data} />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <MinVarStatsPage data={optimizationData?.min_variance_data} />
                </Grid>
              </Grid>
            </>
          )
        )}
      </Container>
    </Fragment>
  );
}