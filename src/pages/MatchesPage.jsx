import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Loader2 } from 'lucide-react';
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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Matches</h2>
          <p className="text-slate-500">Schedule and score matches</p>
        </div>
        <Link to="/matches/schedule" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold">
          <Plus className="w-5 h-5" />
          Schedule Match
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No matches scheduled</h3>
          <p className="text-slate-500 mb-4">Schedule your first match to get started</p>
          <Link to="/matches/schedule" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Schedule Match
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map(match => (
            <div key={match.matchId} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all border border-white/20">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${match.status === 'Completed' ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'}`}>
                      {match.status}
                    </span>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>{match.matchDate} • {match.matchTime}</span>
                    </div>
                    {match.court && (
                      <span className="text-slate-500">📍 {match.court}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-800 text-lg">{match.team1Name}</span>
                    {match.status === 'Completed' && <span className="text-2xl font-bold text-emerald-500">{match.team1Score}</span>}
                    <span className="text-slate-400 font-bold text-xl">VS</span>
                    {match.status === 'Completed' && <span className="text-2xl font-bold text-red-500">{match.team2Score}</span>}
                    <span className="font-bold text-slate-800 text-lg">{match.team2Name}</span>
                  </div>
                </div>
                {match.status === 'Scheduled' && (
                  <Link 
                    to={`/matches/${match.matchId}/score`} 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:shadow-xl transition-all font-semibold"
                  >
                    Score Match
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