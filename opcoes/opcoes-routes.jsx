import { lazy } from "react";
import Loadable from "app/components/Loadable";

const CollarPage = Loadable(lazy(() => import("./CollarPage")));
const OTMCollarPage = Loadable(lazy(() => import("./OTMCollarPage")));

const opcoesRoutes = [
  { path: "/opcoes/riscozero", element: <CollarPage /> },
  { path: "/opcoes/riscozero/otm", element: <OTMCollarPage /> },
];

export default opcoesRoutes;