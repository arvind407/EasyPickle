import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus } from 'lucide-react';
import { matchesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
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
          <p className="text-slate-500 text-sm sm:text-base">Schedule and score matches</p>
        </div>
        <Link 
          to="/matches/schedule" 
          className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold touch-manipulation active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Schedule</span>
        </Link>
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
          <p className="text-slate-500 mb-4 text-sm px-4">Schedule your first match to get started</p>
          <Link 
            to="/matches/schedule" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors touch-manipulation active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Schedule Match
          </Link>
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
                    : 'bg-blue-500 text-white'
                }`}>
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
                  {match.status === 'Completed' && (
                    <span className="text-2xl sm:text-3xl font-bold text-emerald-500 block mt-1">
                      {match.team1Score}
                    </span>
                  )}
                </div>
                
                <span className="text-slate-400 font-bold text-lg sm:text-xl">VS</span>
                
                <div className="flex-1 text-center sm:text-left">
                  <span className="font-bold text-slate-800 text-base sm:text-lg block">
                    {match.team2Name}
                  </span>
                  {match.status === 'Completed' && (
                    <span className="text-2xl sm:text-3xl font-bold text-red-500 block mt-1">
                      {match.team2Score}
                    </span>
                  )}
                </div>
              </div>

              {match.status === 'Scheduled' && (
                <Link 
                  to={`/matches/${match.matchId}/score`} 
                  className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold text-center block touch-manipulation active:scale-95"
                >
                  Score Match
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}