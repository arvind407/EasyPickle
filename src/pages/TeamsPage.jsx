import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { teamsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsAPI.getAll();
      setTeams(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      await teamsAPI.delete(id);
      setTeams(teams.filter(t => t.teamId !== id));
    } catch (err) {
      alert('Failed to delete team: ' + err.message);
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Teams</h2>
          <p className="text-slate-500">Manage tournament teams</p>
        </div>
        <Link to="/teams/create" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold">
          <Plus className="w-5 h-5" />
          Create Team
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No teams yet</h3>
          <p className="text-slate-500 mb-4">Create your first team to get started</p>
          <Link to="/teams/create" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus className="w-5 h-5" />
            Create Team
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map(team => (
            <div key={team.teamId} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border border-white/20">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{team.teamName}</h3>
                  <p className="text-slate-500 font-medium flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {team.playerIds?.length || 0} Players
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-4">
                <div className="text-center flex-1">
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-green-500 bg-clip-text text-transparent">{team.wins || 0}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-1">Wins</p>
                </div>
                <div className="w-px h-12 bg-slate-300"></div>
                <div className="text-center flex-1">
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">{team.losses || 0}</p>
                  <p className="text-xs text-slate-600 font-semibold mt-1">Losses</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all font-medium flex items-center justify-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button onClick={() => handleDelete(team.teamId)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all">
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