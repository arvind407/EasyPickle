import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { playersAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const response = await playersAPI.getAll();
      setPlayers(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (username) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      await playersAPI.delete(username);
      setPlayers(players.filter(p => p.username !== username));
    } catch (err) {
      alert('Failed to delete player: ' + err.message);
    }
  };

  const handleEdit = async (username) => {
    alert("Edit Page is in progress ....")
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Players</h2>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      {players.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No players yet</h3>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Matches</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Points</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {players.map(player => (
                  <tr key={player.playerId} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-800">
                          {player.firstName} {player.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{player.matchesPlayed || 0}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{player.totalPoints || 0}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {/* <button onClick={() => handleEdit(player.username)} className="text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg">
                          <Edit className="w-5 h-5" />
                        </button> */}
                        <button onClick={() => handleDelete(player.username)} className="text-slate-600 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}