import { lazy } from "react";
import Loadable from "app/components/Loadable";

const AgendaPage = Loadable(lazy(() => import("./AgendaPage")));
const StatmentsPage = Loadable(lazy(() => import("./StatmentsPage")));
const DividendsPage = Loadable(lazy(() => import("./DividendsPage")));

const fundamentosRoutes = [
  { path: "/fundamentos/agenda", element: <AgendaPage /> },
  { path: "/fundamentos/statment", element: <StatmentsPage /> },
  { path: "/fundamentos/DY", element: <DividendsPage /> },

];

export default fundamentosRoutes;