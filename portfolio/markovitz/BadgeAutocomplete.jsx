import React, { useState, useEffect } from 'react';
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useTheme } from "@mui/material/styles";
import StandaloneRadio from './StandaloneRadio';
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';
// Ibovespa stocks
const stocks = [
  { symbol: "BOVA11" }, { symbol: "HAPV3" }, { symbol: "B3SA3" }, { symbol: "ABEV3" }, 
  { symbol: "COGN3" }, { symbol: "PETR4" }, { symbol: "CVCB3" }, { symbol: "BBDC4" }, 
  { symbol: "VALE3" }, { symbol: "ITSA4" }, { symbol: "MGLU3" }, { symbol: "RAIL3" }, 
  { symbol: "CSAN3" }, { symbol: "CPLE6" }, { symbol: "AZUL4" }, { symbol: "ITUB4" }, 
  { symbol: "BBAS3" }, { symbol: "ASAI3" }, { symbol: "LREN3" }, { symbol: "RAIZ4" }, 
  { symbol: "USIM5" }, { symbol: "GOLL4" }, { symbol: "VBBR3" }, { symbol: "PETR3" }, 
  { symbol: "WEGE3" }, { symbol: "ANIM3" }, { symbol: "BBDC3" }, { symbol: "AMOB3" }, 
  { symbol: "CRFB3" }, { symbol: "CSNA3" }, { symbol: "EQTL3" }, { symbol: "CMIG4" }, 
  { symbol: "ONCO3" }, { symbol: "GGBR4" }, { symbol: "TIMS3" }, { symbol: "RADL3" }, 
  { symbol: "PCAR3" }, { symbol: "RDOR3" }, { symbol: "POMO4" }, { symbol: "GOAU4" }, 
  { symbol: "RENT3" }, { symbol: "CCRO3" }, { symbol: "AURE3" }, { symbol: "PETZ3" }, 
  { symbol: "MRVE3" }, { symbol: "LWSA3" }, { symbol: "BRAV3" }, { symbol: "BEEF3" }, 
  { symbol: "MOVI3" }, { symbol: "BRFS3" }, { symbol: "RCSL3" }, { symbol: "EMBR3" }, 
  { symbol: "JBSS3" }, { symbol: "BHIA3" }, { symbol: "BPAC11" }, { symbol: "PRIO3" }, 
  { symbol: "UGPA3" }, { symbol: "GFSA3" }, { symbol: "VVEO3" }, { symbol: "ENEV3" }, 
  { symbol: "ELET3" }, { symbol: "CPLE3" }, { symbol: "QUAL3" }, { symbol: "SIMH3" }, 
  { symbol: "STBP3" }, { symbol: "NTCO3" }, { symbol: "MRFG3" }, { symbol: "CBAV3" }, 
  { symbol: "MLAS3" }, { symbol: "CEAB3" }, { symbol: "CMIN3" }, { symbol: "HYPE3" }, 
  { symbol: "GMAT3" }, { symbol: "TOTS3" }, { symbol: "VAMO3" }, { symbol: "YDUQ3" }, 
  { symbol: "KLBN11" }, { symbol: "BBSE3" }, { symbol: "AZEV4" }, { symbol: "EGIE3" }, 
  { symbol: "SUZB3" }, { symbol: "BRKM5" }, { symbol: "GGPS3" }, { symbol: "ALPA4" }, 
  { symbol: "LJQQ3" }, { symbol: "BRAP4" }, { symbol: "CXSE3" }, { symbol: "ALOS3" }, 
  { symbol: "PSSA3" }, { symbol: "ECOR3" }, { symbol: "FLRY3" }, { symbol: "PLPL3" }, 
  { symbol: "CYRE3" }, { symbol: "VIVT3" }, { symbol: "TEND3" }, { symbol: "JHSF3" }, 
  { symbol: "SBSP3" }, { symbol: "IRBR3" }, { symbol: "RCSL4" }, { symbol: "ENGI11" }, 
  { symbol: "HBSA3" }, { symbol: "IFCM3" }, { symbol: "MULT3" }, { symbol: "INTB3" }, 
  { symbol: "AGXY3" }, { symbol: "ISAE4" }, { symbol: "AMER3" }, { symbol: "DXCO3" }, 
  { symbol: "PDGR3" }, { symbol: "SMFT3" }, { symbol: "SLCE3" }, { symbol: "CPFE3" }, 
  { symbol: "EZTC3" },{ symbol: "VIVA3" }, { symbol: "IGTI11" }, { symbol: "CURY3" }, { symbol: "RECV3" },
  { symbol: "DIRR3" }, { symbol: "AZZA3" }, { symbol: "SRNA3" }, { symbol: "TTEN3" },
  { symbol: "SAPR4" }, { symbol: "SBFG3" }, { symbol: "OIBR3" }, { symbol: "RAPT4" },
  { symbol: "SANB11" }, { symbol: "SEQL3" }, { symbol: "ELET6" }, { symbol: "EVEN3" },
  { symbol: "TAEE11" }, { symbol: "BRSR6" }, { symbol: "MDIA3" }, { symbol: "CSMG3" },
  { symbol: "GRND3" }, { symbol: "ODPV3" }, { symbol: "LAVV3" }, { symbol: "MYPK3" },
  { symbol: "SYNE3" }, { symbol: "PGMN3" }, { symbol: "SAPR11" }, { symbol: "VULC3" },
  { symbol: "JALL3" }, { symbol: "CAML3" }, { symbol: "BPAN4" }, { symbol: "ZAMP3" },
  { symbol: "GUAR3" }, { symbol: "SMTO3" }, { symbol: "KLBN4" }, { symbol: "HBOR3" },
  { symbol: "KEPL3" }, { symbol: "PORT3" }, { symbol: "AZEV3" }, { symbol: "RANI3" },
  { symbol: "CASH3" }, { symbol: "NEOE3" }, { symbol: "TUPY3" }, { symbol: "MEAL3" },
  { symbol: "POSI3" }, { symbol: "MILS3" }, { symbol: "MATD3" }, { symbol: "BMGB4" },
  { symbol: "WIZC3" }, { symbol: "ABCB4" }, { symbol: "ORVR3" }, { symbol: "ITUB3" },
  { symbol: "ARML3" }, { symbol: "FRAS3" }, { symbol: "CLSA3" }, { symbol: "PMAM3" },
  { symbol: "TRIS3" }, { symbol: "SOJA3" }, { symbol: "DASA3" }, { symbol: "SEER3" },
  { symbol: "MTRE3" }, { symbol: "AERI3" }, { symbol: "FIQE3" }, { symbol: "ALUP11" },
  { symbol: "HBRE3" }, { symbol: "TECN3" }, { symbol: "VTRU3" }, { symbol: "LOGG3" },
  { symbol: "PTBL3" }, { symbol: "JSLG3" }, { symbol: "MDNE3" }, { symbol: "FESA4" },
  { symbol: "PRNR3" }, { symbol: "OPCT3" }, { symbol: "AMAR3" }, { symbol: "VITT3" },
  { symbol: "BRBI11" }, { symbol: "PNVL3" }, { symbol: "ENJU3" }, { symbol: "TASA4" },
  { symbol: "MELK3" }, { symbol: "LPSB3" }, { symbol: "ELMD3" }, { symbol: "BMOB3" },
  { symbol: "PDTC3" }, { symbol: "TFCO4" }, { symbol: "SHUL4" }, { symbol: "DESK3" },
  { symbol: "BOBR4" }, { symbol: "CSED3" }, { symbol: "TCSA3" }, { symbol: "LAND3" },
  { symbol: "LEVE3" }, { symbol: "ESPA3" }, { symbol: "KLBN3" }, { symbol: "PFRM3" },
  { symbol: "AMBP3" }, { symbol: "LIGT3" }, { symbol: "UCAS3" }, { symbol: "USIM3" },
  { symbol: "POMO3" }, { symbol: "VLID3" }, { symbol: "BLAU3" }, { symbol: "SAPR3" },
  { symbol: "BRST3" }, { symbol: "AGRO3" }, { symbol: "TGMA3" }, { symbol: "ROMI3" },
  { symbol: "UNIP6" }, { symbol: "BIOM3" }, { symbol: "TAEE4" }, { symbol: "RSID3" },
  { symbol: "CMIG3" }, { symbol: "ALPK3" }, { symbol: "SHOW3" }, { symbol: "ITSA3" },
  { symbol: "DEXP3" }, { symbol: "BRAP3" }, { symbol: "ETER3" }, { symbol: "TAEE3" },
  { symbol: "LUPA3" }, { symbol: "DMVF3" }, { symbol: "SANB4" }, { symbol: "SCAR3" },
  { symbol: "INEP3" }, { symbol: "RNEW4" }, { symbol: "IGTI3" }, { symbol: "SANB3" },
  { symbol: "OIBR4" }, { symbol: "PINE4" }, { symbol: "LVTC3" }, { symbol: "RNEW3" },
  { symbol: "GGBR3" }, { symbol: "AALR3" }, { symbol: "OFSA3" }, { symbol: "JFEN3" },
  { symbol: "EUCA4" }, { symbol: "NGRD3" }, { symbol: "ALLD3" }, { symbol: "WHRL4" },
  { symbol: "EALT4" }, { symbol: "VIVR3" }, { symbol: "MBLY3" }, { symbol: "CSUD3" },
  { symbol: "KRSA3" }, { symbol: "GOAU3" }, { symbol: "BEES3" }, { symbol: "RDNI3" },
  { symbol: "AMAR11" }, { symbol: "FHER3" }, { symbol: "TRAD3" }, { symbol: "BMEB4" },
  { symbol: "NUTR3" }, { symbol: "EQPA3" }, { symbol: "CAMB3" }, { symbol: "ATMP3" },
  { symbol: "LOGN3" }, { symbol: "AVLL3" }, { symbol: "RAPT3" }, { symbol: "BRKM3" },
  { symbol: "ALUP4" }, { symbol: "INEP4" }, { symbol: "CEBR6" }, { symbol: "TASA3" },
  { symbol: "ALPA3" }, { symbol: "RPMG3" }, { symbol: "ENGI4" }, { symbol: "DOTZ3" },
  { symbol: "MNPR3" }, { symbol: "ENGI3" }, { symbol: "RPAD5" }, { symbol: "EPAR3" },
  { symbol: "VSTE3" }, { symbol: "TPIS3" }, { symbol: "PTNT4" }, { symbol: "BEES4" },
  { symbol: "HAGA3" }, { symbol: "UNIP3" }, { symbol: "ALUP3" }, { symbol: "COCE5" },
  { symbol: "RSUL4" }, { symbol: "RNEW11" }, { symbol: "EMAE4" }, { symbol: "ESTR4" },
  { symbol: "ISAE3" }, { symbol: "BGIP4" }, { symbol: "BRSR3" }, { symbol: "RPAD3" },
  { symbol: "AZEV11" }, { symbol: "BAZA3" }, { symbol: "MNDL3" }, { symbol: "OSXB3" },
  { symbol: "CGRA4" }, { symbol: "NEXP3" }, { symbol: "WEST3" }, { symbol: "SNSY5" },
  { symbol: "CEBR3" }, { symbol: "EALT3" }, { symbol: "PEAB4" }, { symbol: "MTSA4" },
  { symbol: "BMEB3" }, { symbol: "GEPA4" }, { symbol: "CRPG6" }, { symbol: "CEBR5" },
  { symbol: "BPAC3" }, { symbol: "TELB3" }, { symbol: "WLMM4" }, { symbol: "REDE3" },
  { symbol: "WHRL3" }, { symbol: "CTSA3" }, { symbol: "EKTR4" }, { symbol: "CPLE5" },
  { symbol: "CTSA4" }, { symbol: "CGAS3" }, { symbol: "ENMT3" }, { symbol: "ELET5" },
  { symbol: "CRPG5" }, { symbol: "BRSR5" }, { symbol: "BPAC5" }, { symbol: "PINE3" },
  { symbol: "PPLA11" }, { symbol: "CGAS5" }, { symbol: "BNBR3" }, { symbol: "CLSC4" },
  { symbol: "MRSA3B" }, { symbol: "CGRA3" }, { symbol: "CTKA4" }, { symbol: "FESA3" },
  { symbol: "MGEL4" }, { symbol: "AFLT3" }, { symbol: "DOHL3" }, { symbol: "HAGA4" },
  { symbol: "RPAD6" }, { symbol: "TELB4" }, { symbol: "EQMA3B" }, { symbol: "DEXP4" },
  { symbol: "CEEB3" }, { symbol: "DOHL4" }, { symbol: "FRIO3" }, { symbol: "TKNO4" },
  { symbol: "EUCA3" }, { symbol: "BALM4" }, { symbol: "PSVM11" }, { symbol: "UNIP5" },
  { symbol: "SOND5" }, { symbol: "MRSA6B" }, { symbol: "CEDO4" }, { symbol: "BMIN4" },
  { symbol: "PLAS3" }, { symbol: "AHEB3" }, { symbol: "PATI4" }, { symbol: "GEPA3" },
  { symbol: "MWET4" }, { symbol: "BSLI3" }, { symbol: "MAPT3" }, { symbol: "HOOT4" },
  { symbol: "BIOM11" }, { symbol: "BMKS3" }, { symbol: "PTNT3" }, { symbol: "BSLI4" },
  { symbol: "BDLL3" }, { symbol: "GPAR3" }, { symbol: "BGIP3" }, { symbol: "BMIN3" },
  { symbol: "HETA4" }, { symbol: "MAPT4" }, { symbol: "FIEI3" }, { symbol: "HBTS5" },
  { symbol: "PATI3" }, { symbol: "EQPA5" }, { symbol: "GSHP3" }, { symbol: "WLMM3" },
  { symbol: "LIPR3" }, { symbol: "CLSC3" }, { symbol: "AHEB6" }, { symbol: "BRKM6" },
  { symbol: "NORD3" }, { symbol: "TEKA4" }, { symbol: "EMAE3" }, { symbol: "BALM3" },
  { symbol: "DASA11" }, { symbol: "MWET3" }, { symbol: "ENMT4" }, { symbol: "BAUH4" },
  { symbol: "PEAB3" }, { symbol: "CEDO3" }, { symbol: "BDLL4" }, { symbol: "IGTI4" },
  { symbol: "IGTI4" }
  ];

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 0, 0, 2),
}));

export default function BadgeAutocomplete({ options = stocks, defaultSelected = [], onDataReceived, isLoading, setIsLoading }) {
  const theme = useTheme();
  const [selectedStocks, setSelectedStocks] = useState(defaultSelected);
  const [period, setPeriod] = useState(12);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });
  const [warningSnackbar, setWarningSnackbar] = useState({
    open: false,
    message: '',
    severity: 'warning'
  });

  const handleStockChange = (event, newValue) => {
    setSelectedStocks(newValue);
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleWarningSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setWarningSnackbar({ ...warningSnackbar, open: false });
  };

  const handleGenerateReport = async () => {
    if (selectedStocks.length < 3) {
      setWarningSnackbar({
        open: true,
        message: 'Por favor, selecione pelo menos 3 ativos para otimização.',
        severity: 'warning'
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('https://zommaquant.com.br/api/optimize-portfolio/', {
        stocks: selectedStocks.map(stock => stock.symbol),
        period: period
      });
      
      console.log('API Response:', response.data);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      const processedData = JSON.parse(JSON.stringify(response.data, (key, value) =>
        value !== value ? null : value
      ));
      
      onDataReceived(processedData);
      setSnackbar({
        open: true,
        message: 'Relatório gerado com sucesso!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error generating report:', error);
      // Clear the previous report data
      onDataReceived(null);
      if (error.response && error.response.status === 500) {
        setSnackbar({
          open: true,
          message: 'Não foi possível realizar otimização para esses ativos. Por favor, tente uma combinação diferente.',
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: `Erro: ${error.message || 'Ocorreu um erro inesperado'}`,
          severity: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ /* ... your existing styles ... */ }}>
      <Autocomplete
        multiple
        filterSelectedOptions
        id="mean-variance-optimization"
        options={options}
        getOptionLabel={(option) => option.symbol}
        value={selectedStocks}
        onChange={handleStockChange}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{ width: '100%' }}
            variant="outlined"
            placeholder="Portfolio"
            label="Ativos"
          />
        )}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: theme.spacing(2) }}>
        <StandaloneRadio onPeriodChange={handlePeriodChange} /> 
        <StyledButton 
          variant="contained" 
          color="primary" 
          onClick={handleGenerateReport}
          disabled={isLoading}
        >
          {isLoading ? 'Gerando...' : 'Gerar Relatorio'}
        </StyledButton>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={warningSnackbar.open}
        autoHideDuration={6000}
        onClose={handleWarningSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleWarningSnackbarClose} severity={warningSnackbar.severity} sx={{ width: '100%' }} variant="filled">
          {warningSnackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}