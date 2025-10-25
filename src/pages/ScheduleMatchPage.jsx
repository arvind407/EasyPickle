import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matchesAPI, tournamentsAPI, teamsAPI } from '../services/api';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function ScheduleMatchPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    tournamentId: '',
    team1Id: '',
    team2Id: '',
    matchDate: '',
    matchTime: '',
    court: '' ,
    matchType: 'Practice' // Set default value
  });
  const [tournaments, setTournaments] = useState([]);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTournaments();
    fetchTeams();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentsAPI.getAll();
      setTournaments(response.data || []);
    } catch (err) {
      console.error('Failed to load tournaments:', err);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await teamsAPI.getAll();
      setTeams(response.data || []);
    } catch (err) {
      console.error('Failed to load teams:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.team1Id === formData.team2Id) {
      setError('Please select different teams');
      return;
    }

    setLoading(true);

    try {
      await matchesAPI.schedule(formData);
      navigate('/matches');
    } catch (err) {
      setError(err.message || 'Failed to schedule match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Mobile Back Button */}
      <button
        onClick={() => navigate('/matches')}
        className="mb-4 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors touch-manipulation active:scale-95 sm:hidden"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Schedule Match
      </h2>
      <p className="text-slate-500 mb-6 text-sm sm:text-base">Set up a new match between teams</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-8 border border-white/20">
        <div className="space-y-5">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Team 1 *
              </label>
              <select 
                value={formData.team1Id} 
                onChange={(e) => setFormData({...formData, team1Id: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base" 
                required
              >
                <option value="">Select Team</option>
                {teams.map(team => (
                  <option key={team.teamId} value={team.teamId} disabled={team.teamId === formData.team2Id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Team 2 *
              </label>
              <select 
                value={formData.team2Id} 
                onChange={(e) => setFormData({...formData, team2Id: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base" 
                required
              >
                <option value="">Select Team</option>
                {teams.map(team => (
                  <option key={team.teamId} value={team.teamId} disabled={team.teamId === formData.team1Id}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Date *
              </label>
              <input 
                type="date" 
                value={formData.matchDate} 
                onChange={(e) => setFormData({...formData, matchDate: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Time *
              </label>
              <input 
                type="time" 
                value={formData.matchTime} 
                onChange={(e) => setFormData({...formData, matchTime: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Court
            </label>
            <input 
              type="text" 
              value={formData.court} 
              onChange={(e) => setFormData({...formData, court: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base" 
              placeholder="e.g., Court 1"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Match Type *
            </label>
            <select
              value={formData.matchType}
              onChange={(e) => setFormData({...formData, matchType: e.target.value})}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
              required
            >
              <option value="Practice">Practice</option>
              <option value="League">League</option>
              <option value="QuarterFinal">Quarter Final</option>
              <option value="SemiFinal">Semi Final</option>
              <option value="Final">Final</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 touch-manipulation active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Match'
            )}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/matches')} 
            className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all font-semibold touch-manipulation active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}