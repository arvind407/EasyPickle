import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tournamentsAPI } from '../services/api';
import { Loader2 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditTournamentPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({ 
    name: '', 
    startDate: '', 
    endDate: '', 
    description: '',
    location: '',
    status: 'Upcoming'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTournament();
    }
  }, [id]);

  const fetchTournament = async () => {
    try {
      setLoading(true);
      const response = await tournamentsAPI.getById(id);
      const tournament = response.data;
      
      setFormData({
        name: tournament.name || '',
        startDate: tournament.startDate || '',
        endDate: tournament.endDate || '',
        description: tournament.description || '',
        location: tournament.location || '',
        status: tournament.status || 'Upcoming'
      });
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tournament');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await tournamentsAPI.update(id, formData);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to update tournament');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner message="Loading tournament..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Edit Tournament</h2>
      <p className="text-slate-500 mb-8">Update tournament details</p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Tournament Name *</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              required 
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Start Date *</label>
              <input 
                type="date" 
                value={formData.startDate} 
                onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">End Date *</label>
              <input 
                type="date" 
                value={formData.endDate} 
                onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Status *</label>
            <select 
              value={formData.status} 
              onChange={(e) => setFormData({...formData, status: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              required
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
            <input 
              type="text" 
              value={formData.location} 
              onChange={(e) => setFormData({...formData, location: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              placeholder="e.g., Phoenix, AZ"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
              rows="4"
              placeholder="Tell us about this tournament..."
            ></textarea>
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
              'Update Tournament'
            )}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="flex-1 bg-slate-200 text-slate-700 px-6 py-3 rounded-xl hover:bg-slate-300 transition-all font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}