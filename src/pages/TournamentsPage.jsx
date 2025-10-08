import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Users, Calendar, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { tournamentsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      const response = await tournamentsAPI.getAll();
      setTournaments(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;

    try {
      await tournamentsAPI.delete(id);
      setTournaments(tournaments.filter(t => t.tournamentId !== id));
    } catch (err) {
      alert('Failed to delete tournament: ' + err.message);
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Tournaments</h2>
          <p className="text-slate-500">Manage your pickleball tournaments</p>
        </div>
        <Link to="/tournaments/create" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold">
          <Plus className="w-5 h-5" />
          Create Tournament
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      {tournaments.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No tournaments yet</h3>
          <p className="text-slate-500 mb-4">Create your first tournament to get started</p>
          <Link to="/tournaments/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Create Tournament
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tournaments.map(tournament => (
            <div key={tournament.tournamentId} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{tournament.name}</h3>
                  <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${tournament.status === 'Active' ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'}`}>
                    {tournament.status}
                  </span>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <p className="text-slate-600">{tournament.description}</p>
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">{tournament.startDate} - {tournament.endDate}</span>
                </div>
                {tournament.location && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="font-medium">📍 {tournament.location}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-4 border-t border-slate-100">
                <Link to={`/tournaments/${tournament.tournamentId}/edit`} className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all font-medium flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button onClick={() => handleDelete(tournament.tournamentId)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}