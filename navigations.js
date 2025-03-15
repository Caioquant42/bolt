const navigations = [
/*
  { name: "Dashboard", path: "/dashboard/default", icon: "dashboard" },  
  { label: "PAGES", type: "label" },
  {
    name: "Session/Auth",
    icon: "security",
    children: [
      { name: "Sign in", iconText: "SI", path: "/session/signin" },
      { name: "Sign up", iconText: "SU", path: "/session/signup" },
      { name: "Forgot Password", iconText: "FP", path: "/session/forgot-password" },
      { name: "Error", iconText: "404", path: "/session/404" }
    ]
  },
  { label: "Components", type: "label" },
  {
    name: "Components",
    icon: "favorite",
    badge: { value: "30+", color: "secondary" },
    children: [
      { name: "Auto Complete", path: "/material/autocomplete", iconText: "A" },
      { name: "Buttons", path: "/material/buttons", iconText: "B" },
      { name: "Checkbox", path: "/material/checkbox", iconText: "C" },
      { name: "Dialog", path: "/material/dialog", iconText: "D" },
      { name: "Expansion Panel", path: "/material/expansion-panel", iconText: "E" },
      { name: "Form", path: "/material/form", iconText: "F" },
      { name: "Icons", path: "/material/icons", iconText: "I" },
      { name: "Menu", path: "/material/menu", iconText: "M" },
      { name: "Progress", path: "/material/progress", iconText: "P" },
      { name: "Radio", path: "/material/radio", iconText: "R" },
      { name: "Switch", path: "/material/switch", iconText: "S" },
      { name: "Slider", path: "/material/slider", iconText: "S" },
      { name: "Snackbar", path: "/material/snackbar", iconText: "S" },
      { name: "Table", path: "/material/table", iconText: "T" }
    ]
  },
  {
    name: "Charts",
    icon: "trending_up",
    children: [{ name: "Echarts", path: "/charts/echarts", iconText: "E" }]
  },
  {
    name: "Documentation",
    icon: "launch",
    type: "extLink",
    path: "http://demos.ui-lib.com/matx-react-doc/"
  },

*/

//////////////////////////////ZOMMA///////////////////////////////////
{ label: "Zomma", type: "label" },
{ name: "Dashboard", path: "/zboard/dashboard", icon: "dashboard" },

{
  name: "Recomendações",
  icon: "trending_up",
  children: [
    { name: "Brasil", iconText: "SI", path: "/recommendations/brasil" },
    { name: "USA-NASDAQ", iconText: "SU", path: "/recommendations/nasdaq" },
    { name: "USA-NYSE", iconText: "SU", path: "/recommendations/nyse" },
    

  ]
},

{
  name: "Fundamentos", path: "/", 
  icon: "attach_money",
  children: [
  { name: "Agenda", iconText: "attach_money", path: "/fundamentos/agenda" },
  { name: "Demonstrativos", iconText: "SU", path: "/fundamentos/statment" },
  { name: "Dividendos", iconText: "SU", path: "/fundamentos/DY" },
 ]
},

/*{ name: "Whale Wallet", path: "/", icon: "blur_on" },*/

{
  name: "Screener",
  icon: "my_location",
  children: [
    { name: "RSI", iconText: "SI", path: "/screener/rsi" },
  ]
},
{ name: "RRG", path: "/RRG", icon: "border_inner" },

{
  name: "Opções",
  icon: "attach_money",
  children: [
    { name: "Collar ATM/ITM", iconText: "SI", path: "/opcoes/riscozero" },
    { name: "Collar OTM", iconText: "SU", path: "/opcoes/riscozero/otm" },
    { name: "Inv. Collar ATM/ITM", iconText: "SI", path: "/opcoes/riscozero/inverted" },
    { name: "Inv.Collar OTM", iconText: "SU", path: "/opcoes/riscozero/otm/inverted" },

  ]
},

{
  name: "Volatilidade",
  icon: "3d_rotation",
  children: [
    { name: "VI vs VH", iconText: "SI", path: "/volatilidade/analysis" },
    { name: "Superfície VI", iconText: "SU", path: "/volatilidade/surface"}
  ]
},

{
  name: "Long & Short",
  icon: "import_export",
  children: [
    { name: "Ações", iconText: "SI", path: "/longshort/stocks" },
    { name: "Moedas", iconText: "SU", path: "/longshort/currency"}
  ]
},

{ name: "Portfólio", path: "/portfolio/markovitz", icon: "donut_small" },
{ name: "Sobrevivência", path: "/survival", icon: "donut_small" },

];

export default navigations;
