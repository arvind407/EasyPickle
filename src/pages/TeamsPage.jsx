import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import { teamsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [searchQuery, teams]);

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

  const filterTeams = () => {
    if (!searchQuery.trim()) {
      setFilteredTeams(teams);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = teams.filter(team => 
      team.teamName.toLowerCase().includes(query) ||
      team.tournamentName?.toLowerCase().includes(query)
    );
    setFilteredTeams(filtered);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">Teams</h2>
          <p className="text-slate-500">Manage tournament teams</p>
        </div>
        <Link to="/teams/create" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold w-fit">
          <Plus className="w-5 h-5" />
          Create Team
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
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
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No teams found</h3>
          <p className="text-slate-500">Try adjusting your search query</p>
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Team Name</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Players</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Wins</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Losses</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Win Rate</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeams.map(team => {
                  const totalGames = (team.wins || 0) + (team.losses || 0);
                  const winRate = totalGames > 0 ? ((team.wins || 0) / totalGames * 100).toFixed(0) : 0;
                  
                  return (
                    <tr key={team.teamId} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-slate-800">{team.teamName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg font-bold">
                          {team.playerIds?.length || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-emerald-600 text-lg">
                          {team.wins || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="font-bold text-red-600 text-lg">
                          {team.losses || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                              style={{ width: `${winRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-slate-600 w-10">
                            {winRate}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            to={`/teams/${team.teamId}/edit`}
                            className="text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                            title="Edit team"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(team.teamId, team.teamName)}
                            className="text-slate-600 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Delete team"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Results count */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredTeams.length}</span> of <span className="font-semibold">{teams.length}</span> teams
            </p>
          </div>
        </div>
      )}
    </div>
  );
}