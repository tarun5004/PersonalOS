import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './app/routes/ProtectedRoute.jsx';
import { PublicRoute } from './app/routes/PublicRoute.jsx';
import { protectedRoutes, publicRoutes } from './app/routes/routeConfig.js';
import { RouteLoading } from './app/routes/RouteLoading.jsx';
import { AppLayout } from './components/layout/AppLayout.jsx';
import { NotFoundPage } from './features/system/pages/NotFoundPage.jsx';

function App() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route element={<Navigate replace to="/dashboard" />} path="/" />

        {publicRoutes.map((route) => (
          <Route
            element={
              <PublicRoute>
                <route.Component />
              </PublicRoute>
            }
            key={route.path}
            path={route.path}
          />
        ))}

        <Route
          element={
            <ProtectedRoute>
              <AppLayout routes={protectedRoutes} />
            </ProtectedRoute>
          }
        >
          {protectedRoutes.map((route) => (
            <Route element={<route.Component />} key={route.path} path={route.path} />
          ))}
        </Route>

        <Route element={<NotFoundPage />} path="*" />
      </Routes>
    </Suspense>
  );
}

export default App;
