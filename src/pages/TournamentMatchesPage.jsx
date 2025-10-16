// src/pages/TournamentMatchesPage.jsx - ENHANCED VERSION
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Plus, RefreshCw, Filter, X } from 'lucide-react';
import { matchesAPI, teamsAPI } from '../services/api';
import { useRole } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TournamentMatchesPage() {
  const { id } = useParams(); // Tournament ID
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState('All');
  const [teamFilter, setTeamFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  const { canCreate, canEdit } = useRole();

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    applyFilters();
  }, [matches, statusFilter, teamFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch matches
      const matchesResponse = await matchesAPI.getAll();
      const allMatches = matchesResponse.data || [];
      const tournamentMatches = allMatches.filter(match => match.tournamentId === id);
      setMatches(tournamentMatches);
      
      // Fetch teams for filter dropdown
      const teamsResponse = await teamsAPI.getAll();
      const allTeams = teamsResponse.data || [];
      const tournamentTeams = allTeams.filter(team => team.tournamentId === id);
      setTeams(tournamentTeams);
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...matches];

    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(match => match.status === statusFilter);
    }

    // Filter by team
    if (teamFilter !== 'All') {
      filtered = filtered.filter(match => 
        match.team1Id === teamFilter || match.team2Id === teamFilter
      );
    }

    setFilteredMatches(filtered);
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchData();
    } catch (err) {
      setError(err.message || 'Failed to refresh matches');
    } finally {
      setRefreshing(false);
    }
  };

  const clearFilters = () => {
    setStatusFilter('All');
    setTeamFilter('All');
  };

  const hasActiveFilters = statusFilter !== 'All' || teamFilter !== 'All';

  // Count matches by status
  const scheduledCount = matches.filter(m => m.status === 'Scheduled').length;
  const inProgressCount = matches.filter(m => m.status === 'In Progress').length;
  const completedCount = matches.filter(m => m.status === 'Completed').length;

  if (loading && matches.length === 0) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Matches
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            {canCreate ? 'Schedule and score matches' : 'View match schedule and results'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 sm:px-5 sm:py-3 rounded-xl flex items-center gap-2 transition-all font-semibold touch-manipulation active:scale-95 disabled:opacity-50"
            title="Refresh matches"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          
          {canCreate && (
            <Link 
              to="/matches/schedule" 
              className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold touch-manipulation active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Schedule</span>
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Filter Toggle Button (Mobile) */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="sm:hidden w-full mb-4 flex items-center justify-between gap-2 bg-white/90 backdrop-blur-sm text-slate-700 px-4 py-3 rounded-xl border-2 border-slate-200 font-semibold touch-manipulation active:scale-95"
      >
        <span className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
              Active
            </span>
          )}
        </span>
        <span className="text-sm text-slate-500">
          {filteredMatches.length} of {matches.length}
        </span>
      </button>

      {/* Filters Section */}
      <div className={`mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-white/20 ${showFilters ? 'block' : 'hidden sm:block'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800">Filters</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-semibold"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Match Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
            >
              <option value="All">All Status ({matches.length})</option>
              <option value="Scheduled">Scheduled ({scheduledCount})</option>
              <option value="In Progress">In Progress ({inProgressCount})</option>
              <option value="Completed">Completed ({completedCount})</option>
            </select>
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Filter by Team
            </label>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
            >
              <option value="All">All Teams</option>
              {teams.map(team => (
                <option key={team.teamId} value={team.teamId}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {statusFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                Status: {statusFilter}
                <button
                  onClick={() => setStatusFilter('All')}
                  className="hover:text-indigo-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {teamFilter !== 'All' && (
              <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                Team: {teams.find(t => t.teamId === teamFilter)?.teamName}
                <button
                  onClick={() => setTeamFilter('All')}
                  className="hover:text-purple-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-slate-600">
        Showing <span className="font-semibold">{filteredMatches.length}</span> of <span className="font-semibold">{matches.length}</span> matches
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No matches scheduled</h3>
          <p className="text-slate-500 mb-4 text-sm px-4">
            {canCreate ? 'Schedule your first match to get started' : 'No matches available yet'}
          </p>
          {canCreate && (
            <Link 
              to="/matches/schedule" 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors touch-manipulation active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Schedule Match
            </Link>
          )}
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No matches found</h3>
          <p className="text-slate-500 mb-4 text-sm px-4">
            Try adjusting your filters to see more matches
          </p>
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors touch-manipulation active:scale-95"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map(match => (
            <div 
              key={match.matchId} 
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 sm:p-6 border border-white/20"
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  match.status === 'Completed' 
                    ? 'bg-slate-500 text-white' 
                    : match.status === 'In Progress'
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-blue-500 text-white'
                }`}>
                  {match.status === 'In Progress' && '🔴 '}
                  {match.status}
                </span>
                <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{match.matchDate} • {match.matchTime}</span>
                </div>
                {match.court && (
                  <span className="text-slate-500 text-sm">📍 {match.court}</span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <div className="flex-1 text-center sm:text-right">
                  <span className="font-bold text-slate-800 text-base sm:text-lg block">
                    {match.team1Name}
                  </span>
                  {(match.status === 'Completed' || match.status === 'In Progress') && (
                    <span className={`text-2xl sm:text-3xl font-bold block mt-1 ${
                      match.status === 'In Progress' ? 'text-indigo-600' : 'text-emerald-500'
                    }`}>
                      {match.team1Score || 0}
                    </span>
                  )}
                </div>
                
                <span className="text-slate-400 font-bold text-lg sm:text-xl">VS</span>
                
                <div className="flex-1 text-center sm:text-left">
                  <span className="font-bold text-slate-800 text-base sm:text-lg block">
                    {match.team2Name}
                  </span>
                  {(match.status === 'Completed' || match.status === 'In Progress') && (
                    <span className={`text-2xl sm:text-3xl font-bold block mt-1 ${
                      match.status === 'In Progress' ? 'text-purple-600' : 'text-red-500'
                    }`}>
                      {match.team2Score || 0}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                {match.status === 'Scheduled' && canEdit && (
                  <Link 
                    to={`/matches/${match.matchId}/score`} 
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold text-center touch-manipulation active:scale-95"
                  >
                    Start Match
                  </Link>
                )}
                
                {match.status === 'In Progress' && canEdit && (
                  <Link 
                    to={`/matches/${match.matchId}/score`} 
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold text-center flex items-center justify-center gap-2 touch-manipulation active:scale-95"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    Continue Scoring
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}