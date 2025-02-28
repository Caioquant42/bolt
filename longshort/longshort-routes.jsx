import { lazy } from "react";
import Loadable from "app/components/Loadable";

const LongShortStocks = Loadable(lazy(() => import("./LongShortPage")));

const longshortRoutes = [
  { path: "/longshort/stocks", element: <LongShortStocks /> }
];

export default longshortRoutes;