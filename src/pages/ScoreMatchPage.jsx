import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, Loader2, ArrowLeft, Trophy, Save, RefreshCw } from 'lucide-react';
import { matchesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRole } from '../context/AuthContext';

export default function ScoreMatchPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { canEdit } = useRole();
  const [match, setMatch] = useState(null);
  const [score, setScore] = useState({ team1Score: 0, team2Score: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [gameWinner, setGameWinner] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMatch();
    }
  }, [id]);

  // Check for winner when score changes
  useEffect(() => {
    checkForWinner();
  }, [score]);

  const fetchMatch = async () => {
    try {
      setLoading(true);
      const response = await matchesAPI.getById(id);
      const matchData = response.data;
      setMatch(matchData);
      
      // Load existing scores if match is in progress
      if (matchData.status === 'In Progress' || matchData.status === 'Scheduled') {
        const currentScore = {
          team1Score: matchData.team1Score || 0,
          team2Score: matchData.team2Score || 0
        };
        setScore(currentScore);
      }
      
      setError('');
      setHasUnsavedChanges(false);
    } catch (err) {
      setError(err.message || 'Failed to load match');
    } finally {
      setLoading(false);
    }
  };

  const checkForWinner = () => {
    // Pickleball is typically played to 11 points, win by 2
    const winningScore = 11;
    const { team1Score, team2Score } = score;

    if (team1Score >= winningScore && team1Score - team2Score >= 2) {
      setGameWinner('team1');
    } else if (team2Score >= winningScore && team2Score - team1Score >= 2) {
      setGameWinner('team2');
    } else {
      setGameWinner(null);
    }
  };

  const saveLiveScore = async () => {
    if (saving || submitting) return;
    
    setSaving(true);
    setError('');
    
    try {
      await matchesAPI.updateLiveScore(id, score);
      setHasUnsavedChanges(false);
      
      // Show brief success message
      const successMsg = document.getElementById('save-success-msg');
      if (successMsg) {
        successMsg.style.display = 'block';
        setTimeout(() => {
          successMsg.style.display = 'none';
        }, 2000);
      }
    } catch (err) {
      setError('Failed to save live score: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const refreshLiveScore = async () => {
    setRefreshing(true);
    try {
      await fetchMatch();
    } catch (err) {
      setError('Failed to refresh score: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  const incrementScore = (team) => {
    setScore(prev => ({
      ...prev,
      [team]: prev[team] + 1
    }));
    setHasUnsavedChanges(true);
  };

  const decrementScore = (team) => {
    setScore(prev => ({
      ...prev,
      [team]: Math.max(0, prev[team] - 1)
    }));
    setHasUnsavedChanges(true);
  };

  const handleFinishGame = async () => {
    if (!confirm('Are you sure you want to finish this game? This will mark the match as completed.')) return;

    setError('');
    setSubmitting(true);

    try {
      // Save final score and complete the match
      await matchesAPI.score(id, score);
      // Navigate back to tournament matches page
      navigate(`/tournament/${match.tournamentId}/matches`);
    } catch (err) {
      setError(err.message || 'Failed to save match score');
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

  // If user doesn't have permission to edit and match is not in progress, show read-only view
  const isReadOnly = !canEdit || match.status === 'Completed';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate(`/tournament/${match.tournamentId}/matches`)}
        className="mb-4 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors touch-manipulation active:scale-95 sm:hidden"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <div className="flex items-start justify-between mb-2">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          {isReadOnly ? 'Live Score' : 'Score Match'}
        </h2>
        
        {/* Refresh Button for viewers and admins */}
        <button
          onClick={refreshLiveScore}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all font-semibold text-sm touch-manipulation active:scale-95 disabled:opacity-50"
          title="Refresh live score"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
      
      <p className="text-slate-500 mb-6 text-sm sm:text-base">
        {isReadOnly ? 'Follow the live match score' : 'Track points live during the match'}
      </p>

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
            {/* Add Match Type */}
            {match.matchType && (
              <span className="hidden sm:inline">
        •       <span className="font-bold text-indigo-600">
                  {match.matchType === 'QuarterFinal' ? 'Quarter Final' :
                  match.matchType === 'SemiFinal' ? 'Semi Final' :
                  match.matchType}
                </span>
              </span>
            )}
          </div>
          {match.court && <div className="text-center text-sm text-slate-600 mb-3 sm:hidden">{match.court}</div>}

          {/* Show match type on mobile */}
          {match.matchType && (
            <div className="text-center text-sm mb-3 sm:hidden">
              <span className="font-bold text-indigo-600">
                {match.matchType === 'QuarterFinal' ? 'Quarter Final' :
                match.matchType === 'SemiFinal' ? 'Semi Final' :
                match.matchType}
              </span>
            </div>
          )}
          
          {/* Live Badge */}
          {match.status === 'In Progress' && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-red-600 font-bold text-sm">LIVE</span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <span className="font-bold text-xl sm:text-2xl text-slate-800 text-center">{match.team1Name}</span>
            <span className="text-slate-400 font-bold text-xl sm:text-2xl">VS</span>
            <span className="font-bold text-xl sm:text-2xl text-slate-800 text-center">{match.team2Name}</span>
          </div>
        </div>

        {/* Winner Banner */}
        {gameWinner && !isReadOnly && (
          <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-2xl text-center animate-pulse">
            <p className="text-xl sm:text-2xl font-bold">
              🏆 {gameWinner === 'team1' ? match.team1Name : match.team2Name} Wins!
            </p>
            <p className="text-sm mt-1 opacity-90">Click "Finish Game" to save the results</p>
          </div>
        )}

        {/* Live Score Display */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 mb-8">
          {/* Team 1 Score */}
          <div className="text-center">
            <label className="block text-sm font-bold text-slate-700 mb-3 sm:mb-4">
              {match.team1Name}
            </label>
            <div className="relative">
              <div className={`text-6xl sm:text-8xl font-bold mb-4 transition-all ${
                gameWinner === 'team1' ? 'text-emerald-500 scale-110' : 'text-indigo-600'
              }`}>
                {score.team1Score}
              </div>
              {!isReadOnly && (
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => decrementScore('team1Score')}
                    disabled={score.team1Score === 0}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 text-white rounded-xl font-bold text-2xl hover:bg-red-600 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all touch-manipulation shadow-lg"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => incrementScore('team1Score')}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 text-white rounded-xl font-bold text-2xl hover:bg-emerald-600 active:scale-95 transition-all touch-manipulation shadow-lg"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Team 2 Score */}
          <div className="text-center">
            <label className="block text-sm font-bold text-slate-700 mb-3 sm:mb-4">
              {match.team2Name}
            </label>
            <div className="relative">
              <div className={`text-6xl sm:text-8xl font-bold mb-4 transition-all ${
                gameWinner === 'team2' ? 'text-emerald-500 scale-110' : 'text-purple-600'
              }`}>
                {score.team2Score}
              </div>
              {!isReadOnly && (
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => decrementScore('team2Score')}
                    disabled={score.team2Score === 0}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 text-white rounded-xl font-bold text-2xl hover:bg-red-600 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all touch-manipulation shadow-lg"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() => incrementScore('team2Score')}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-500 text-white rounded-xl font-bold text-2xl hover:bg-emerald-600 active:scale-95 transition-all touch-manipulation shadow-lg"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center text-sm text-slate-500 mb-6">
          <p>Playing to 11 points • Win by 2</p>
          {!isReadOnly && hasUnsavedChanges && (
            <p className="text-amber-600 font-semibold mt-2">
              ⚠️ You have unsaved changes
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {!isReadOnly && (
          <div className="flex flex-col gap-3 pt-6 border-t border-slate-200">
            {/* Save Live Score Button */}
            <button 
              type="button"
              onClick={saveLiveScore}
              disabled={saving || !hasUnsavedChanges}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation active:scale-95"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Live Score
                </>
              )}
            </button>
            
            {/* Success message */}
            <div 
              id="save-success-msg" 
              className="hidden text-center text-sm text-emerald-600 font-semibold"
            >
              ✓ Live score saved successfully!
            </div>

            {/* Finish Game Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                type="button"
                onClick={handleFinishGame}
                disabled={submitting || (score.team1Score === 0 && score.team2Score === 0)}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-xl hover:shadow-xl transition-all font-bold text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 touch-manipulation active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Finishing...
                  </>
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    Finish Game
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/tournament/${match.tournamentId}/matches`)}
                className="flex-1 bg-slate-200 text-slate-700 px-6 py-4 rounded-xl hover:bg-slate-300 transition-all font-bold text-base sm:text-lg touch-manipulation active:scale-95"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {isReadOnly && (
          <div className="pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(`/tournament/${match.tournamentId}/matches`)}
              className="w-full bg-slate-200 text-slate-700 px-6 py-4 rounded-xl hover:bg-slate-300 transition-all font-bold text-base sm:text-lg touch-manipulation active:scale-95"
            >
              Back to Matches
            </button>
          </div>
        )}
      </div>
    </div>
  );
}