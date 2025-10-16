// src/pages/TournamentsPage.jsx - UPDATED VERSION
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy, Plus, Edit, Trash2, Search, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { tournamentsAPI } from '../services/api';
import { useRole } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDateRange } from '../utils/dateUtils';

export default function TournamentsPage() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { canCreate, canEdit, canDelete } = useRole();
  const { selectTournament } = useTournament();

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

  const handleTournamentClick = (tournament) => {
    selectTournament(tournament);
    navigate(`/tournament/${tournament.tournamentId}`);
  };

  const handleDelete = async (e, id, name) => {
    e.stopPropagation(); // Prevent tournament click
    if (!canDelete) {
      alert('You do not have permission to delete tournaments');
      return;
    }

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
              Tournaments
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              {canCreate ? 'Select a tournament to manage' : 'Select a tournament to view'}
            </p>
          </div>
          {canCreate && (
            <Link 
              to="/tournaments/create" 
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
          <p className="text-slate-500 mb-4 text-sm px-4">
            {canCreate ? 'Create your first tournament to get started' : 'No tournaments available'}
          </p>
          {canCreate && (
            <Link 
              to="/tournaments/create" 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors touch-manipulation active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Create Tournament
            </Link>
          )}
        </div>
      ) : filteredTournaments.length === 0 ? (
        <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
          <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-600 mb-2">No tournaments found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your search query</p>
        </div>
      ) : (
        <>
          {/* Tournament Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTournaments.map(tournament => (
              <div 
                key={tournament.tournamentId} 
                onClick={() => handleTournamentClick(tournament)}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate text-lg group-hover:text-indigo-600 transition-colors">
                        {tournament.name}
                      </h3>
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
                  
                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
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

                {(canEdit || canDelete) && (
                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    {canEdit && (
                      <Link 
                        to={`/tournaments/${tournament.tournamentId}/edit`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all font-semibold text-sm touch-manipulation active:scale-95"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                    )}
                    {canDelete && (
                      <button 
                        onClick={(e) => handleDelete(e, tournament.tournamentId, tournament.name)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-all font-semibold text-sm touch-manipulation active:scale-95"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Results count */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold">{filteredTournaments.length}</span> of <span className="font-semibold">{tournaments.length}</span> tournaments
            </p>
          </div>
        </>
      )}
    </div>
  );
}