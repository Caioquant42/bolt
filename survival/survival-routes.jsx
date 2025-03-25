import { lazy } from "react";
import Loadable from "app/components/Loadable";

const SurvivalPage = Loadable(lazy(() => import("./SurvivalPage")));

const survivalRoutes = [
  { path: "/survival", element: <SurvivalPage /> }
];

export default survivalRoutes;