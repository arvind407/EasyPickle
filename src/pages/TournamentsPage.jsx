import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Plus, Edit, Trash2, Search, Calendar, MapPin } from 'lucide-react';
import { tournamentsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateRange } from '../utils/dateUtils';

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTournaments();
  }, []);

  useEffect(() => {
    filterTournaments();
  }, [searchQuery, tournaments]);

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

  const filterTournaments = () => {
    if (!searchQuery.trim()) {
      setFilteredTournaments(tournaments);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tournaments.filter(tournament => 
      tournament.name.toLowerCase().includes(query) ||
      tournament.description?.toLowerCase().includes(query) ||
      tournament.location?.toLowerCase().includes(query) ||
      tournament.status.toLowerCase().includes(query)
    );
    setFilteredTournaments(filtered);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Tournaments
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">Manage your pickleball tournaments</p>
          </div>
          <Link 
            to="/tournaments/create" 
            className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 sm:px-6 sm:py-3 rounded-xl flex items-center gap-2 hover:shadow-xl transition-all font-semibold touch-manipulation active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tournaments..."
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

      {tournaments.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No tournaments yet</h3>
          <p className="text-slate-500 mb-4 text-sm px-4">Create your first tournament to get started</p>
          <Link 
            to="/tournaments/create" 
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors touch-manipulation active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create Tournament
          </Link>
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No tournaments found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search query</p>
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="space-y-4 sm:hidden">
            {filteredTournaments.map(tournament => (
              <div 
                key={tournament.tournamentId} 
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-white/20 active:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate text-lg">{tournament.name}</h3>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                        tournament.status === 'Active' 
                          ? 'bg-emerald-500 text-white' 
                          : tournament.status === 'Completed'
                          ? 'bg-slate-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {tournament.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">{formatDateRange(tournament.startDate, tournament.endDate)}</span>
                  </div>
                  {tournament.location && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{tournament.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link 
                    to={`/tournaments/${tournament.tournamentId}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2.5 rounded-xl hover:bg-indigo-100 transition-all font-semibold text-sm touch-manipulation active:scale-95"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(tournament.tournamentId, tournament.name)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-100 transition-all font-semibold text-sm touch-manipulation active:scale-95"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold">Tournament Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Dates</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTournaments.map(tournament => (
                    <tr key={tournament.tournamentId} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Trophy className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-slate-800">{tournament.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">
                        {formatDateRange(tournament.startDate, tournament.endDate)}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {tournament.location || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          tournament.status === 'Active' 
                            ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white' 
                            : tournament.status === 'Completed'
                            ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                        }`}>
                          {tournament.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link 
                            to={`/tournaments/${tournament.tournamentId}/edit`}
                            className="text-slate-600 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                            title="Edit tournament"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(tournament.tournamentId, tournament.name)}
                            className="text-slate-600 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                            title="Delete tournament"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Results count */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold">{filteredTournaments.length}</span> of <span className="font-semibold">{tournaments.length}</span> tournaments
              </p>
            </div>
          </div>

          {/* Mobile Results Count */}
          <div className="sm:hidden mt-4 text-center">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredTournaments.length}</span> of <span className="font-semibold">{tournaments.length}</span> tournaments
            </p>
          </div>
        </>
      )}
    </div>
  );
}