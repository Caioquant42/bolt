import { lazy } from "react";
import Loadable from "app/components/Loadable";

const RRGPage = Loadable(lazy(() => import("./RRGPage")));

const rrgRoutes = [
  { path: "/RRG", element: <RRGPage /> }
];

export default rrgRoutes;