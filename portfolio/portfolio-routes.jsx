import { lazy } from "react";
import Loadable from "app/components/Loadable";

const AppMarkovitz = Loadable(lazy(() => import("./markovitz/AppMarkovitz")));


const portfolioRoutes = [
  { path: "/portfolio/markovitz", element: <AppMarkovitz /> },
];

export default portfolioRoutes;