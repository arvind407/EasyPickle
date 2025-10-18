import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teamsAPI, tournamentsAPI } from '../services/api';
import { useTournament } from '../context/TournamentContext';
import { Loader2, ArrowLeft } from 'lucide-react';

export default function CreateTeamPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Tournament ID from URL if in tournament context
  const { selectedTournament } = useTournament();
  const [formData, setFormData] = useState({ teamName: '', tournamentId: '' });
  const [tournament, setTournament] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we have a tournament ID from context or URL, fetch that tournament
    const tournamentId = id || selectedTournament?.tournamentId;
    if (tournamentId) {
      fetchTournament(tournamentId);
      setFormData(prev => ({ ...prev, tournamentId }));
    }
  }, [id, selectedTournament]);

  const fetchTournament = async (tournamentId) => {
    try {
      const response = await tournamentsAPI.getById(tournamentId);
      setTournament(response.data);
    } catch (err) {
      console.error('Failed to load tournament:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await teamsAPI.create(formData);
      
      // Navigate back to appropriate page based on context
      if (id) {
        navigate(`/tournament/${id}/teams`);
      } else {
        navigate('/teams');
      }
    } catch (err) {
      setError(err.message || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (id) {
      navigate(`/tournament/${id}/teams`);
    } else {
      navigate('/teams');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Mobile Back Button */}
      <button
        onClick={handleCancel}
        className="mb-4 flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors touch-manipulation active:scale-95 sm:hidden"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </button>

      <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
        Create Team
      </h2>
      <p className="text-slate-500 mb-6 text-sm sm:text-base">
        {tournament ? `Add a new team to ${tournament.name}` : 'Add a new team to your tournament'}
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-8 border border-white/20">
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
              placeholder="Enter team name"
              required 
            />
          </div>
          
          {tournament && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tournament
              </label>
              <input 
                type="text" 
                value={tournament.name}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-600 cursor-not-allowed text-base" 
                readOnly
                disabled
              />
              <p className="mt-1 text-xs text-slate-500">Team will be added to this tournament</p>
            </div>
          )}
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
                Creating...
              </>
            ) : (
              'Create Team'
            )}
          </button>
          <button 
            type="button" 
            onClick={handleCancel} 
            className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all font-semibold touch-manipulation active:scale-95"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}