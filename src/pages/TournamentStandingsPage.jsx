// src/pages/TournamentStandingsPage.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Medal } from 'lucide-react';
import { standingsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TournamentStandingsPage() {
  const { id } = useParams(); // Tournament ID
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchStandings();
    }
  }, [id]);

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const response = await standingsAPI.getByTournament(id);
      setStandings(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load standings');
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-500';
    if (rank === 2) return 'from-slate-300 to-slate-400';
    if (rank === 3) return 'from-orange-400 to-orange-500';
    return 'from-slate-100 to-slate-200';
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) return <Medal className="w-5 h-5 text-white" />;
    return null;
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
          Standings
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">Tournament leaderboard</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {standings.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm px-4">No standings available yet. Teams need to play matches first.</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="space-y-4 sm:hidden">
            {standings.map(team => (
              <div 
                key={team.teamId} 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg bg-gradient-to-br ${getRankColor(team.rank)}`}>
                    {<span className="text-slate-600">{team.rank}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-lg truncate">{team.teamName}</h3>
                    <p className="text-sm text-slate-600">{team.played} games played</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">{team.points}</p>
                    <p className="text-xs text-slate-500">points</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-emerald-50 rounded-xl">
                    <p className="text-xl font-bold text-emerald-600">{team.wins}</p>
                    <p className="text-xs text-slate-600 font-medium">Wins</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-xl">
                    <p className="text-xl font-bold text-red-600">{team.losses}</p>
                    <p className="text-xs text-slate-600 font-medium">Losses</p>
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
                  <th className="px-6 py-4 text-left text-sm font-bold">Rank</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Team</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Played</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Wins</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Losses</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {standings.map(team => (
                  <tr key={team.teamId} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg bg-gradient-to-br`}>
                        {<span className="text-slate-600">{team.rank}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{team.teamName}</td>
                    <td className="px-6 py-4 text-center text-slate-600 font-medium">{team.played}</td>
                    <td className="px-6 py-4 text-center font-bold text-emerald-600">{team.wins}</td>
                    <td className="px-6 py-4 text-center font-bold text-red-600">{team.losses}</td>
                    <td className="px-6 py-4 text-center font-bold text-xl text-indigo-600">{team.points}</td>
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