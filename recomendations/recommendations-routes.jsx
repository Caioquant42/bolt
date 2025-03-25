import { lazy } from "react";
import Loadable from "app/components/Loadable";

const AppBrasil = Loadable(lazy(() => import("./brasil/AppBrasil")));
const AppNASDAQ = Loadable(lazy(() => import("./usa/AppNASDAQ")));
const AppNYSE = Loadable(lazy(() => import("./usa/AppNYSE")));

const recomendationsRoutes = [
  { path: "/recommendations/brasil", element: <AppBrasil /> },
  { path: "/recommendations/nasdaq", element: <AppNASDAQ /> },
  { path: "/recommendations/nyse", element: <AppNYSE /> }
];

export default recomendationsRoutes;