import { lazy } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "./auth/AuthGuard";
import { authRoles } from "./auth/authRoles";

import Loadable from "./components/Loadable";
import MatxLayout from "./components/MatxLayout/MatxLayout";
import sessionRoutes from "./views/sessions/session-routes";
import recomendationsRoutes from "app/views/recomendations/recommendations-routes";
import screenerRoutes from "app/views/screener/screener-routes";
import zboardRoutes from "app/views/zboard/zboard-routes";
import volatilidadeRoutes from "app/views/volatilidade/volatilidade-routes";
import rrgRoutes from "app/views/rrg/rrg-routes";
import survivalRoutes from "app/views/survival/survival-routes";
import portfolioRoutes from "app/views/portfolio/portfolio-routes";
import fundamentosRoutes from "app/views/fundamentos/fundamentos-routes";
import longshortRoutes from "app/views/longshort/longshort-routes";
import opcoesRoutes from "app/views/opcoes/opcoes-routes";

// E-CHART PAGE
// DASHBOARD PAGE


const routes = [
  { path: "/", element: <Navigate to="zboard/dashboard" /> },
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [
      ...recomendationsRoutes,
      ...screenerRoutes,
      ...zboardRoutes,
      ...volatilidadeRoutes,
      ...rrgRoutes,
      ...survivalRoutes,
      ...portfolioRoutes,
      ...fundamentosRoutes,
      ...longshortRoutes,
      ...opcoesRoutes,
      // dashboard route
    
      // e-chart route
  
    ]
  },

  // session pages route
  ...sessionRoutes
];

export default routes;
