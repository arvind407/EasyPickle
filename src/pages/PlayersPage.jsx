import { useState, useEffect } from 'react';
import { User, Trophy, Mail } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 flex justify-center items-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
          Players
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">Registered players</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {players.length === 0 ? (
        <div className="text-center py-12">
          <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No players yet</h3>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="space-y-4 sm:hidden">
            {players.map(player => (
              <div 
                key={player.username} 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {player.firstName} {player.lastName}
                    </h3>
                    <p className="text-sm text-slate-600 flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {player.email}
                    </p>
                    <p className="text-xs text-slate-500">@{player.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-indigo-50 rounded-xl">
                    <p className="text-2xl font-bold text-indigo-600">{player.matchesPlayed || 0}</p>
                    <p className="text-xs text-slate-600 font-medium">Matches</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">{player.totalPoints || 0}</p>
                    <p className="text-xs text-slate-600 font-medium">Points</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Matches</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {players.map(player => (
                  <tr key={player.username} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-800">
                          {player.firstName} {player.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{player.matchesPlayed || 0}</td>
                    <td className="px-6 py-4 font-bold text-indigo-600">{player.totalPoints || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}