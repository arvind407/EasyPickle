import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Loader2, ArrowLeft } from 'lucide-react';
import { matchesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ScoreMatchPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [score, setScore] = useState({ team1Score: 0, team2Score: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchMatch();
    }
  }, [id]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const response = await matchesAPI.getById(id);
      setMatch(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await matchesAPI.score(id, score);
      navigate('/matches');
    } catch (err) {
      setError(err.message || 'Failed to score match');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Match not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate('/matches')}
        className="mb-4 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors touch-manipulation active:scale-95 sm:hidden"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Score Match
      </h2>
      <p className="text-slate-500 mb-6 text-sm sm:text-base">Enter the match results</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-8 border border-white/20">
        <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-slate-600 mb-3 font-medium">
            <Calendar className="w-4 h-4" />
            <span>{match.matchDate} • {match.matchTime}</span>
            {match.court && <span className="hidden sm:inline">• {match.court}</span>}
          </div>
          {match.court && <div className="text-center text-sm text-slate-600 mb-3 sm:hidden">{match.court}</div>}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <span className="font-bold text-xl sm:text-2xl text-slate-800 text-center">{match.team1Name}</span>
            <span className="text-slate-400 font-bold text-xl sm:text-2xl">VS</span>
            <span className="font-bold text-xl sm:text-2xl text-slate-800 text-center">{match.team2Name}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div className="text-center">
              <label className="block text-sm font-bold text-slate-700 mb-3 sm:mb-4">
                {match.team1Name} Score
              </label>
              <input 
                type="number" 
                min="0" 
                value={score.team1Score} 
                onChange={(e) => setScore({...score, team1Score: parseInt(e.target.value) || 0})} 
                className="w-full text-center text-4xl sm:text-5xl font-bold px-4 sm:px-6 py-6 sm:py-8 border-4 border-indigo-200 rounded-2xl focus:ring-4 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-gradient-to-br from-white to-indigo-50" 
                required 
              />
            </div>
            <div className="text-center">
              <label className="block text-sm font-bold text-slate-700 mb-3 sm:mb-4">
                {match.team2Name} Score
              </label>
              <input 
                type="number" 
                min="0" 
                value={score.team2Score} 
                onChange={(e) => setScore({...score, team2Score: parseInt(e.target.value) || 0})} 
                className="w-full text-center text-4xl sm:text-5xl font-bold px-4 sm:px-6 py-6 sm:py-8 border-4 border-purple-200 rounded-2xl focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition-all bg-gradient-to-br from-white to-purple-50" 
                required 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
            <button 
              type="submit" 
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-xl transition-all font-bold text-base sm:text-lg disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation active:scale-95"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Score'
              )}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/matches')} 
              className="flex-1 bg-slate-200 text-slate-700 px-6 py-4 rounded-xl hover:bg-slate-300 transition-all font-bold text-base sm:text-lg touch-manipulation active:scale-95"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}