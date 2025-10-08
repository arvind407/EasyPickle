import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { standingsAPI, tournamentsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function StandingsPage() {
  const [standings, setStandings] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    if (selectedTournament) {
      fetchStandings();
    }
  }, [selectedTournament]);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentsAPI.getAll();
      const tournamentList = response.data || [];
      setTournaments(tournamentList);
      
      // Auto-select first active tournament
      const activeTournament = tournamentList.find(t => t.status === 'Active');
      if (activeTournament) {
        setSelectedTournament(activeTournament.tournamentId);
      } else if (tournamentList.length > 0) {
        setSelectedTournament(tournamentList[0].tournamentId);
      }
    } catch (err) {
      console.error('Failed to load tournaments:', err);
    }
  };

  const fetchStandings = async () => {
    try {
      setLoading(true);
      const response = await standingsAPI.getByTournament(selectedTournament);
      setStandings(response.data || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load standings');
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Standings</h2>
        <p className="text-slate-500">Tournament leaderboard</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold text-slate-700 mb-2">Select Tournament</label>
        <select
          value={selectedTournament}
          onChange={(e) => setSelectedTournament(e.target.value)}
          className="w-full md:w-96 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
        >
          <option value="">Select a tournament</option>
          {tournaments.map(tournament => (
            <option key={tournament.tournamentId} value={tournament.tournamentId}>
              {tournament.name} ({tournament.status})
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : !selectedTournament ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <p className="text-slate-500">Please select a tournament to view standings</p>
        </div>
      ) : standings.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <p className="text-slate-500">No standings available yet. Teams need to play matches first.</p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
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
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
                          team.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white' : 
                          team.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' : 
                          team.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' : 
                          'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600'
                        }`}>
                          {team.rank}
                        </div>
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
        </div>
      )}
    </div>
  );
}