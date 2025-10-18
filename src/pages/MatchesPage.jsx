import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Eye, RefreshCw } from 'lucide-react';
import { matchesAPI } from '../services/api';
import { useRole } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  
  const { canCreate, canEdit } = useRole();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await matchesAPI.getAll();
      setMatches(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const response = await matchesAPI.getAll();
      setMatches(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to refresh matches');
    } finally {
      setRefreshing(false);
    }
  };

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
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex-shrink-0 bg-slate-100 hover:bg-slate-200 text-slate-700 p-3 sm:px-5 sm:py-3 rounded-xl flex items-center gap-2 transition-all font-semibold touch-manipulation active:scale-95 disabled:opacity-50"
            title="Refresh matches"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          
          {/* Create Button */}
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
      ) : (
        <div className="space-y-4">
          {matches.map(match => (
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

                {/* Add Match Type Badge */}
                {match.matchType && (
                  <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    match.matchType === 'Final' 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white' 
                    : match.matchType === 'SemiFinal'
                    ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                    : match.matchType === 'QuarterFinal'
                    ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                    : match.matchType === 'Practice'
                    ? 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
                    : 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white'
                    }`}>
                    {match.matchType === 'QuarterFinal' ? 'Quarter Final' :
                    match.matchType === 'SemiFinal' ? 'Semi Final' :
                    match.matchType}
                  </span>
                )}

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

              {/* Action buttons */}
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