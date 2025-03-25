import { lazy } from "react";
import Loadable from "app/components/Loadable";

const LongShortStocks = Loadable(lazy(() => import("./LongShortPage")));
const LongShortCurrency = Loadable(lazy(() => import("./LongShortCurrencyPage")));

const longshortRoutes = [
  { path: "/longshort/stocks", element: <LongShortStocks /> },
  { path: "/longshort/currency", element: <LongShortCurrency /> },
];

export default longshortRoutes;