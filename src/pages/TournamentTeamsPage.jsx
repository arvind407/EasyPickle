// src/pages/TournamentTeamsPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, Plus, Edit, Trash2, Search } from 'lucide-react';
import { teamsAPI } from '../services/api';
import { useRole } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function TournamentTeamsPage() {
  const { id } = useParams(); // Tournament ID
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { canCreate, canEdit, canDelete } = useRole();

  useEffect(() => {
    fetchTeams();
  }, [id]);

  useEffect(() => {
    filterTeams();
  }, [searchQuery, teams]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await teamsAPI.getAll();
      const allTeams = response.data || [];
      // Filter teams for this tournament
      const tournamentTeams = allTeams.filter(team => team.tournamentId === id);
      setTeams(tournamentTeams);
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
      team.teamName.toLowerCase().includes(query)
    );
    setFilteredTeams(filtered);
  };

  const handleDelete = async (teamId, name) => {
    if (!canDelete) {
      alert('You do not have permission to delete teams');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await teamsAPI.delete(teamId);
      setTeams(teams.filter(t => t.teamId !== teamId));
    } catch (err) {
      alert('Failed to delete team: ' + err.message);
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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Teams
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              {canCreate ? 'Manage tournament teams' : 'View tournament teams'}
            </p>
          </div>
          {canCreate && (
            <Link 
              to={`/tournament/${id}/teams/create`}
              className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold touch-manipulation active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Create</span>
            </Link>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-base"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No teams yet</h3>
          <p className="text-slate-500 mb-4 text-sm px-4">
            {canCreate ? 'Create your first team to get started' : 'No teams available'}
          </p>
          {canCreate && (
            <Link 
              to={`/tournament/${id}/teams/create`}
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors touch-manipulation active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create Team
            </Link>
          )}
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No teams found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search query</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
            <div className="sm:hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-2 text-sm font-semibold text-slate-600">Team</th>
                    <th className="text-center py-2 px-2 text-sm font-semibold text-slate-600">W</th>
                    <th className="text-center py-2 px-2 text-sm font-semibold text-slate-600">L</th>
                    {(canEdit || canDelete) && (
                      <th className="text-center py-2 px-2 text-sm font-semibold text-slate-600">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map(team => (
                    <tr key={team.teamId} className="border-b border-slate-100">
                      <td className="py-3 px-2">
                        <p className="font-semibold text-slate-800">{team.teamName}</p>
                        <p className="text-xs text-slate-500">{team.playerIds.join(', ')}</p>
                      </td>
                      <td className="py-3 px-2 text-center font-semibold text-emerald-600">{team.wins || 0}</td>
                      <td className="py-3 px-2 text-center font-semibold text-red-600">{team.losses || 0}</td>
                      {(canEdit || canDelete) && (
                        <td className="py-3 px-2">
                          <div className="flex gap-1 justify-center">
                            {canEdit && (
                              <Link 
                                to={`/teams/${team.teamId}/edit`}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                            )}
                            {canDelete && (
                              <button 
                                onClick={() => handleDelete(team.teamId, team.teamName)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Team Name</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Players</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Wins</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Losses</th>
                    {(canEdit || canDelete) && (
                      <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTeams.map(team => {
                    const totalGames = (team.wins || 0) + (team.losses || 0);
          
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
                          <span className="inline-flex items-center justify-center px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg font-bold">
                            {team.playerIds.join(', ')}
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
                        {(canEdit || canDelete) && (
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              {canEdit && (
                                <Link 
                                  to={`/teams/${team.teamId}/edit`}
                                  className="text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                                  title="Edit team"
                                >
                                  <Edit className="w-5 h-5" />
                                </Link>
                              )}
                              {canDelete && (
                                <button 
                                  onClick={() => handleDelete(team.teamId, team.teamName)}
                                  className="text-slate-600 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                  title="Delete team"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
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

          {/* Mobile Results Count */}
          <div className="sm:hidden mt-4 text-center">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredTeams.length}</span> of <span className="font-semibold">{teams.length}</span> teams
            </p>
          </div>
        </>
      )}
    </div>
  );
}