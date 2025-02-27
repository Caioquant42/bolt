import { lazy } from "react";
import Loadable from "app/components/Loadable";

const VolSurfacePage = Loadable(lazy(() => import("./surface/VolSurfacePage")));
const VolatilityPage = Loadable(lazy(() => import("./VolatilityPage")));

const volatilidadeRoutes = [
  { path: "/volatilidade/surface", element: <VolSurfacePage /> },
  { path: "/volatilidade/analysis", element: <VolatilityPage /> }
];

export default volatilidadeRoutes;