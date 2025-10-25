// src/pages/TournamentHomePage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, Edit } from 'lucide-react';
import { tournamentsAPI, matchesAPI, teamsAPI } from '../services/api';
import { useTournament } from '../context/TournamentContext';
import { useRole } from '../context/AuthContext';
import { formatDateRange } from '../utils/dateUtils';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TournamentHomePage() {
  const { id } = useParams();
  const { selectTournament } = useTournament();
  const { canEdit } = useRole();
  const [tournament, setTournament] = useState(null);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTournamentData();
    }
  }, [id]);

  const fetchTournamentData = async () => {
    try {
      setLoading(true);
      
      // Fetch tournament details
      const tournamentResponse = await tournamentsAPI.getById(id);
      const tournamentData = tournamentResponse.data;
      setTournament(tournamentData);
      selectTournament(tournamentData);

      // Fetch upcoming matches for this tournament
      const matchesResponse = await matchesAPI.getAll();
      const allMatches = matchesResponse.data || [];
      const tournamentMatches = allMatches
        .filter(match => match.tournamentId === id && match.status !== 'Completed')
        .slice(0, 3); // Get next 3 matches
      setUpcomingMatches(tournamentMatches);

      // Fetch teams for this tournament
      const teamsResponse = await teamsAPI.getAll();
      const allTeams = teamsResponse.data || [];
      const tournamentTeams = allTeams.filter(team => team.tournamentId === id);
      setTeams(tournamentTeams);

      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tournament data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Tournament not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tournament Header */}
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">{tournament.name}</h1>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                tournament.status === 'Active' 
                  ? 'bg-emerald-500 text-white' 
                  : tournament.status === 'Completed'
                  ? 'bg-slate-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}>
                {tournament.status}
              </span>
            </div>
          </div>
          
          {canEdit && (
            <Link
              to={`/tournaments/${tournament.tournamentId}/edit`}
              className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
              title="Edit tournament"
            >
              <Edit className="w-5 h-5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 text-slate-600">
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{formatDateRange(tournament.startDate, tournament.endDate)}</span>
          </div>
          
          {tournament.location && (
            <div className="flex items-center gap-3 text-slate-600">
              <MapPin className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{tournament.location}</span>
            </div>
          )}
        </div>

        {tournament.description && (
          <p className="mt-4 text-slate-600 leading-relaxed">{tournament.description}</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to={`/tournament/${id}/matches`}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <Calendar className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">View Matches</h3>
          <p className="text-sm text-white/80">See schedule and results</p>
        </Link>

        <Link
          to={`/tournament/${id}/teams`}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <Users className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">View Teams</h3>
          <p className="text-sm text-white/80">Browse participating teams</p>
        </Link>

        <Link
          to={`/tournament/${id}/standings`}
          className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <Trophy className="w-8 h-8 mb-3" />
          <h3 className="font-bold text-lg mb-1">View Standings</h3>
          <p className="text-sm text-white/80">Check current rankings</p>
        </Link>
      </div>
    </div>
  );
}