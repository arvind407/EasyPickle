// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TournamentProvider } from './context/TournamentContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import MainLayout from './layouts/MainLayout';
import TournamentLayout from './layouts/TournamentLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TournamentsPage from './pages/TournamentsPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import EditTournamentPage from './pages/EditTournamentPage';

// Tournament-specific pages
import TournamentHomePage from './pages/TournamentHomePage';
import TournamentMatchesPage from './pages/TournamentMatchesPage';
import TournamentTeamsPage from './pages/TournamentTeamsPage';
import TournamentStandingsPage from './pages/TournamentStandingsPage';

// Other pages
import CreateTeamPage from './pages/CreateTeamPage';
import EditTeamPage from './pages/EditTeamPage';
import PlayersPage from './pages/PlayersPage';
import ScheduleMatchPage from './pages/ScheduleMatchPage';
import ScoreMatchPage from './pages/ScoreMatchPage';
import TournamentGroupsPage from './pages/TournamentGroupsPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Home - Tournaments List (accessible to all authenticated users) */}
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
      
      {/* Tournament Detail Routes */}
      <Route path="/tournament/:id" element={
        <ProtectedRoute>
          <TournamentLayout>
            <TournamentHomePage />
          </TournamentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tournament/:id/matches" element={
        <ProtectedRoute>
          <TournamentLayout>
            <TournamentMatchesPage />
          </TournamentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tournament/:id/teams" element={
        <ProtectedRoute>
          <TournamentLayout>
            <TournamentTeamsPage />
          </TournamentLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/tournament/:id/standings" element={
        <ProtectedRoute>
          <TournamentLayout>
            <TournamentStandingsPage />
          </TournamentLayout>
        </ProtectedRoute>
      } />
      
      {/* Team Management Routes */}
      <Route path="/teams/create" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <CreateTeamPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/teams/:id/edit" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <EditTeamPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Players Page - Global view */}
      <Route path="/players" element={
        <ProtectedRoute>
          <MainLayout>
            <PlayersPage />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Match Management Routes */}
      <Route path="/matches/schedule" element={
        <ProtectedRoute>
          <AdminRoute>
            <MainLayout>
              <ScheduleMatchPage />
            </MainLayout>
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      <Route path="/matches/:id/score" element={
        <ProtectedRoute>
          <MainLayout>
            <ScoreMatchPage />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/tournament/:id/groups" element={
        <ProtectedRoute>
          <TournamentLayout>
            <TournamentGroupsPage />
          </TournamentLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TournamentProvider>
        <Router>
          <AppRoutes />
        </Router>
      </TournamentProvider>
    </AuthProvider>
  );
}