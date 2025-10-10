import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teamsAPI, tournamentsAPI, playersAPI } from '../services/api';
import { Loader2, UserPlus, X, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditTeamPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ 
    teamName: '', 
    tournamentId: '' 
  });
  const [tournaments, setTournaments] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPlayerSelector, setShowPlayerSelector] = useState(false);

  useEffect(() => {
    fetchTournaments();
    fetchPlayers();
    if (id) {
      fetchTeam();
    }
  }, [id]);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentsAPI.getAll();
      setTournaments(response.data || []);
    } catch (err) {
      console.error('Failed to load tournaments:', err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const response = await playersAPI.getAll();
      const allPlayers = response.data || [];
      
      const unassignedPlayers = allPlayers.filter(player => 
        !player.teamId || player.teamId === id
      );
      
      setAvailablePlayers(unassignedPlayers);
    } catch (err) {
      console.error('Failed to load players:', err);
    }
  };

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await teamsAPI.getById(id);
      const team = response.data;
      
      setFormData({
        teamName: team.teamName || '',
        tournamentId: team.tournamentId || ''
      });

      const playersResponse = await playersAPI.getAll();
      const allPlayers = playersResponse.data || [];
      const currentTeamPlayers = allPlayers.filter(player => player.teamId === id);
      setTeamPlayers(currentTeamPlayers);
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load team');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = async (player) => {
    if (teamPlayers.length >= 2) {
      setError('Teams can only have a maximum of 2 players');
      return;
    }

    try {
      await playersAPI.update(player.username, { teamId: id });
      
      setTeamPlayers([...teamPlayers, player]);
      setAvailablePlayers(availablePlayers.filter(p => p.username !== player.username));
      setShowPlayerSelector(false);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to add player to team');
    }
  };

  const handleRemovePlayer = async (player) => {
    try {
      await playersAPI.update(player.username, { teamId: null });
      
      setTeamPlayers(teamPlayers.filter(p => p.username !== player.username));
      setAvailablePlayers([...availablePlayers, player]);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to remove player from team');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await teamsAPI.update(id, formData);
      navigate('/teams');
    } catch (err) {
      setError(err.message || 'Failed to update team');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Loading team..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate('/teams')}
        className="mb-4 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors touch-manipulation active:scale-95 sm:hidden"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Edit Team
      </h2>
      <p className="text-slate-500 mb-6 text-sm sm:text-base">Update team details and manage players</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-8 border border-white/20 space-y-6">
        {/* Team Details */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Team Name *
            </label>
            <input 
              type="text" 
              value={formData.teamName} 
              onChange={(e) => setFormData({...formData, teamName: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tournament
            </label>
            <select 
              value={formData.tournamentId} 
              onChange={(e) => setFormData({...formData, tournamentId: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
            >
              <option value="">Select Tournament (Optional)</option>
              {tournaments.map(tournament => (
                <option key={tournament.tournamentId} value={tournament.tournamentId}>
                  {tournament.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Players Section */}
        <div className="border-t border-slate-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Team Players ({teamPlayers.length}/2)
            </h3>
            {teamPlayers.length < 2 && (
              <button
                type="button"
                onClick={() => setShowPlayerSelector(!showPlayerSelector)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl hover:bg-indigo-700 transition-colors font-semibold text-sm touch-manipulation active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Player</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>

          {/* Current Team Players */}
          {teamPlayers.length > 0 ? (
            <div className="space-y-3 mb-4">
              {teamPlayers.map(player => (
                <div 
                  key={player.username} 
                  className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200"
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="font-bold text-slate-800 truncate">
                      {player.firstName} {player.lastName}
                    </p>
                    <p className="text-sm text-slate-600 truncate">{player.email}</p>
                    <p className="text-xs text-slate-500">@{player.username}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(player)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors touch-manipulation active:scale-95 flex-shrink-0"
                    title="Remove player from team"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 mb-4">
              <p className="text-slate-500 text-sm px-4">No players assigned to this team yet</p>
            </div>
          )}

          {/* Player Selector */}
          {showPlayerSelector && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-slate-700">Available Players</h4>
                <button
                  type="button"
                  onClick={() => setShowPlayerSelector(false)}
                  className="text-slate-400 hover:text-slate-600 sm:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {availablePlayers.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availablePlayers
                    .filter(player => !teamPlayers.find(tp => tp.username === player.username))
                    .map(player => (
                      <button
                        key={player.username}
                        type="button"
                        onClick={() => handleAddPlayer(player)}
                        className="w-full flex items-center justify-between p-3 bg-white hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200 hover:border-indigo-300 touch-manipulation active:scale-95"
                      >
                        <div className="text-left flex-1 min-w-0 mr-3">
                          <p className="font-semibold text-slate-800 truncate">
                            {player.firstName} {player.lastName}
                          </p>
                          <p className="text-sm text-slate-600 truncate">{player.email}</p>
                          <p className="text-xs text-slate-500">@{player.username}</p>
                        </div>
                        <UserPlus className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                      </button>
                    ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4 text-sm">
                  No available players. All players are assigned to teams.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200">
          <button 
            type="submit" 
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation active:scale-95"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Team'
            )}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/teams')} 
            className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all font-semibold touch-manipulation active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}