import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { VehicleRegistryPage } from './pages/VehicleRegistryPage';
import { TripDispatcherPage } from './pages/TripDispatcherPage';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy-loaded new pages (code-split for performance)
const MaintenancePage = lazy(() => import('./pages/maintenance/MaintenancePage').then(m => ({ default: m.MaintenancePage })));
const ExpensesPage = lazy(() => import('./pages/expenses/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const DriversPage = lazy(() => import('./pages/drivers/DriversPage').then(m => ({ default: m.DriversPage })));
const AnalyticsPage = lazy(() => import('./pages/analytics/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));

function LazyPage({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      {children}
    </Suspense>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="fleetflow-theme">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />

          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/vehicles" element={<VehicleRegistryPage />} />
              <Route path="/trips" element={<TripDispatcherPage />} />
              <Route path="/maintenance" element={<LazyPage><MaintenancePage /></LazyPage>} />
              <Route path="/expenses" element={<LazyPage><ExpensesPage /></LazyPage>} />
              <Route path="/drivers" element={<LazyPage><DriversPage /></LazyPage>} />
              <Route path="/analytics" element={<LazyPage><AnalyticsPage /></LazyPage>} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
