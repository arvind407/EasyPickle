import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { teamsAPI, tournamentsAPI } from '../services/api';
import { Loader2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditTeamPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ 
    teamName: '', 
    tournamentId: '' 
  });
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTournaments();
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

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const response = await teamsAPI.getById(id);
      const team = response.data;
      
      setFormData({
        teamName: team.teamName || '',
        tournamentId: team.tournamentId || ''
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load team');
    } finally {
      setLoading(false);
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
      <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Edit Team</h2>
      <p className="text-slate-500 mb-8">Update team details</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Team Name *</label>
            <input 
              type="text" 
              value={formData.teamName} 
              onChange={(e) => setFormData({...formData, teamName: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tournament</label>
            <select 
              value={formData.tournamentId} 
              onChange={(e) => setFormData({...formData, tournamentId: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
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
        <div className="flex gap-4 mt-8">
          <button 
            type="submit" 
            disabled={submitting}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
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
            className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}