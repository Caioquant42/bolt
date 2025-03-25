import { lazy } from "react";
import Loadable from "app/components/Loadable";

const AppRSI = Loadable(lazy(() => import("./RSI/AppRSI")));
const AppScreenVol = Loadable(lazy(() => import("./vol/AppScreenVol")));

const screenerRoutes = [
  { path: "/screener/rsi", element: <AppRSI /> },
  { path: "/screener/vol", element: <AppScreenVol /> }
];

export default screenerRoutes;