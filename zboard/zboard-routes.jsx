import SBPage from './shared/SBPage';
import { lazy } from "react";
import Loadable from "app/components/Loadable";

const AppZboard = Loadable(lazy(() => import("./AppZboard")));

const zboardRoutes = [
  { path: "/zboard/dashboard", element: <AppZboard /> }
];

export default zboardRoutes;