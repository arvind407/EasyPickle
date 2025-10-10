import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/LoginPage';
import TournamentsPage from './pages/TournamentsPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import TeamsPage from './pages/TeamsPage';
import CreateTeamPage from './pages/CreateTeamPage';
import PlayersPage from './pages/PlayersPage';
import CreatePlayerPage from './pages/CreatePlayerPage';
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
      
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <TournamentsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tournaments/create" element={
        <ProtectedRoute>
          <MainLayout>
            <CreateTournamentPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/teams" element={
        <ProtectedRoute>
          <MainLayout>
            <TeamsPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/teams/create" element={
        <ProtectedRoute>
          <MainLayout>
            <CreateTeamPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/players" element={
        <ProtectedRoute>
          <MainLayout>
            <PlayersPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/players/create" element={
        <ProtectedRoute>
          <MainLayout>
            <CreatePlayerPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/matches" element={
        <ProtectedRoute>
          <MainLayout>
            <MatchesPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/matches/schedule" element={
        <ProtectedRoute>
          <MainLayout>
            <ScheduleMatchPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/matches/:id/score" element={
        <ProtectedRoute>
          <MainLayout>
            <ScoreMatchPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/standings" element={
        <ProtectedRoute>
          <MainLayout>
            <StandingsPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/tournaments/:id/edit" element={
        <ProtectedRoute>
          <MainLayout>
            <EditTournamentPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/teams/:id/edit" element={
        <ProtectedRoute>
          <MainLayout>
            <EditTeamPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/register" element={<RegisterPage />} />

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