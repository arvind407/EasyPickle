import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Medal, FolderOpen } from 'lucide-react';
import { standingsAPI, groupsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TournamentGroupStandingsPage() {
  const { id } = useParams(); // Tournament ID
  const [standings, setStandings] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch standings
      const standingsResponse = await standingsAPI.getByTournament(id);
      setStandings(standingsResponse.data || []);
      
      // Fetch groups
      const groupsResponse = await groupsAPI.getAll(id);
      setGroups(groupsResponse.data || []);
      
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load standings');
      setStandings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStandingsByGroup = (groupName) => {
    return standings.filter(team => team.groupName === groupName);
  };

  const ungroupedStandings = standings.filter(team => !team.groupName);

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
          Group Standings
        </h2>
        <p className="text-slate-500 text-sm sm:text-base">View standings organized by groups</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {standings.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-sm px-4">No standings available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Group Standings */}
          {groups.map(group => {
            const groupStandings = getStandingsByGroup(group.groupName);
            
            if (groupStandings.length === 0) return null;
            
            return (
              <div key={group.groupId} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white">{group.groupName}</h3>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Mobile View */}
                  <div className="space-y-3 sm:hidden">
                    {groupStandings.map(team => (
                      <div key={team.teamId} className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-white">
                            {team.rank}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{team.teamName}</h4>
                            <p className="text-sm text-slate-600">{team.played} games</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-indigo-600">{team.points}</p>
                            <p className="text-xs text-slate-500">pts</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-emerald-50 rounded-lg">
                            <p className="text-lg font-bold text-emerald-600">{team.wins}</p>
                            <p className="text-xs text-slate-600">Wins</p>
                          </div>
                          <div className="text-center p-2 bg-red-50 rounded-lg">
                            <p className="text-lg font-bold text-red-600">{team.losses}</p>
                            <p className="text-xs text-slate-600">Losses</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop View */}
                  <table className="w-full hidden sm:table">
                    <thead className="border-b-2 border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Rank</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Team</th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">P</th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">W</th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">L</th>
                        <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">Pts</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {groupStandings.map(team => (
                        <tr key={team.teamId} className="hover:bg-indigo-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-white text-sm">
                              {team.rank}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-800">{team.teamName}</td>
                          <td className="px-4 py-3 text-center text-slate-600 font-medium">{team.played}</td>
                          <td className="px-4 py-3 text-center font-bold text-emerald-600">{team.wins}</td>
                          <td className="px-4 py-3 text-center font-bold text-red-600">{team.losses}</td>
                          <td className="px-4 py-3 text-center font-bold text-xl text-indigo-600">{team.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          {/* Ungrouped Teams */}
          {ungroupedStandings.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-slate-600 to-slate-700 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Ungrouped Teams</h3>
              </div>
              
              <div className="p-4">
                {/* Mobile View */}
                <div className="space-y-3 sm:hidden">
                  {ungroupedStandings.map(team => (
                    <div key={team.teamId} className="bg-slate-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center font-bold text-white">
                          {team.rank}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{team.teamName}</h4>
                          <p className="text-sm text-slate-600">{team.played} games</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-indigo-600">{team.points}</p>
                          <p className="text-xs text-slate-500">pts</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-emerald-50 rounded-lg">
                          <p className="text-lg font-bold text-emerald-600">{team.wins}</p>
                          <p className="text-xs text-slate-600">Wins</p>
                        </div>
                        <div className="text-center p-2 bg-red-50 rounded-lg">
                          <p className="text-lg font-bold text-red-600">{team.losses}</p>
                          <p className="text-xs text-slate-600">Losses</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View */}
                <table className="w-full hidden sm:table">
                  <thead className="border-b-2 border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Rank</th>
                      <th className="px-4 py-3 text-left text-sm font-bold text-slate-700">Team</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">P</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">W</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">L</th>
                      <th className="px-4 py-3 text-center text-sm font-bold text-slate-700">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ungroupedStandings.map(team => (
                      <tr key={team.teamId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center font-bold text-white text-sm">
                            {team.rank}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">{team.teamName}</td>
                        <td className="px-4 py-3 text-center text-slate-600 font-medium">{team.played}</td>
                        <td className="px-4 py-3 text-center font-bold text-emerald-600">{team.wins}</td>
                        <td className="px-4 py-3 text-center font-bold text-red-600">{team.losses}</td>
                        <td className="px-4 py-3 text-center font-bold text-xl text-indigo-600">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}