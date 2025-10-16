import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import TournamentsPage from './pages/TournamentsPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import TeamsPage from './pages/TeamsPage';
import CreateTeamPage from './pages/CreateTeamPage';
import PlayersPage from './pages/PlayersPage';
import MatchesPage from './pages/MatchesPage';
import ScheduleMatchPage from './pages/ScheduleMatchPage';
import ScoreMatchPage from './pages/ScoreMatchPage';
import StandingsPage from './pages/StandingsPage';
import EditTournamentPage from './pages/EditTournamentPage';
import EditTeamPage from './pages/EditTeamPage';
import RegisterPage from './pages/RegisterPage';

function AppRoutes() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Home - Tournaments (accessible to all authenticated users) */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <TournamentsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Create Tournament - Admin only */}
      <Route path="/tournaments/create" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <CreateTournamentPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Edit Tournament - Admin only */}
      <Route path="/tournaments/:id/edit" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <EditTournamentPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Teams (accessible to all authenticated users) */}
      <Route path="/teams" element={
        <ProtectedRoute>
          <MainLayout>
            <TeamsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Create Team - Admin only */}
      <Route path="/teams/create" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <CreateTeamPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Edit Team - Admin only */}
      <Route path="/teams/:id/edit" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <EditTeamPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Players (accessible to all authenticated users) */}
      <Route path="/players" element={
        <ProtectedRoute>
          <MainLayout>
            <PlayersPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Matches (accessible to all authenticated users) */}
      <Route path="/matches" element={
        <ProtectedRoute>
          <MainLayout>
            <MatchesPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Schedule Match - Admin only */}
      <Route path="/matches/schedule" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <ScheduleMatchPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Score Match - Admin only */}
      <Route path="/matches/:id/score" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <ScoreMatchPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Standings (accessible to all authenticated users) */}
      <Route path="/standings" element={
        <ProtectedRoute>
          <MainLayout>
            <StandingsPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}