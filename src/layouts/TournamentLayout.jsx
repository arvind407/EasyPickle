import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Calendar, Users, BarChart3, Home, LogOut, ArrowLeft, FolderOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTournament } from '../context/TournamentContext';

export default function TournamentLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { selectedTournament, clearTournament } = useTournament();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleBackToTournaments = () => {
    clearTournament();
    navigate('/');
    closeMenu();
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20 lg:pb-0">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-lg shadow-indigo-500/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={handleBackToTournaments}
                className="p-2 rounded-xl hover:bg-indigo-50 active:bg-indigo-100 touch-manipulation"
                aria-label="Back to tournaments"
              >
                <ArrowLeft className="w-5 h-5 text-indigo-600" />
              </button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold text-slate-800 truncate">
                  {selectedTournament?.name || 'Tournament'}
                </h1>
                <p className="text-xs text-slate-500 font-medium">Easy Pickle</p>
              </div>
            </div>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="lg:hidden p-2 rounded-xl hover:bg-indigo-50 active:bg-indigo-100 touch-manipulation"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6 text-indigo-600" /> : <Menu className="w-6 h-6 text-indigo-600" />}
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <nav className="flex gap-2">
                <NavLink 
                  to={`/tournament/${selectedTournament?.tournamentId}`} 
                  icon={Home} 
                  label="Home" 
                  active={isActive(`/tournament/${selectedTournament?.tournamentId}`)} 
                />
                <NavLink 
                  to={`/tournament/${selectedTournament?.tournamentId}/matches`} 
                  icon={Calendar} 
                  label="Matches" 
                  active={isActive(`/tournament/${selectedTournament?.tournamentId}/matches`)} 
                />
                <NavLink 
                  to={`/tournament/${selectedTournament?.tournamentId}/teams`} 
                  icon={Users} 
                  label="Teams" 
                  active={isActive(`/tournament/${selectedTournament?.tournamentId}/teams`)} 
                />
                <NavLink 
                  to={`/tournament/${selectedTournament?.tournamentId}/groups`} 
                  icon={FolderOpen} 
                  label="Groups" 
                  active={isActive(`/tournament/${selectedTournament?.tournamentId}/groups`)} 
                />
                <NavLink 
                  to={`/tournament/${selectedTournament?.tournamentId}/standings`} 
                  icon={BarChart3} 
                  label="Standings" 
                  active={isActive(`/tournament/${selectedTournament?.tournamentId}/standings`)} 
                />
              </nav>
              
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                <span className="text-sm text-slate-600 font-medium">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {menuOpen && (
            <nav className="lg:hidden mt-4 pb-2 space-y-1 animate-slideDown">
              <MobileNavLink 
                to={`/tournament/${selectedTournament?.tournamentId}`} 
                icon={Home} 
                label="Home" 
                active={isActive(`/tournament/${selectedTournament?.tournamentId}`)} 
                onClick={closeMenu} 
              />
              <MobileNavLink 
                to={`/tournament/${selectedTournament?.tournamentId}/matches`} 
                icon={Calendar} 
                label="Matches" 
                active={isActive(`/tournament/${selectedTournament?.tournamentId}/matches`)} 
                onClick={closeMenu} 
              />
              <MobileNavLink 
                to={`/tournament/${selectedTournament?.tournamentId}/teams`} 
                icon={Users} 
                label="Teams" 
                active={isActive(`/tournament/${selectedTournament?.tournamentId}/teams`)} 
                onClick={closeMenu} 
              />
              <MobileNavLink 
                to={`/tournament/${selectedTournament?.tournamentId}/groups`} 
                icon={FolderOpen} 
                label="Groups" 
                active={isActive(`/tournament/${selectedTournament?.tournamentId}/groups`)} 
                onClick={closeMenu} 
              />
              <MobileNavLink 
                to={`/tournament/${selectedTournament?.tournamentId}/standings`} 
                icon={BarChart3} 
                label="Standings" 
                active={isActive(`/tournament/${selectedTournament?.tournamentId}/standings`)} 
                onClick={closeMenu} 
              />
              
              <div className="pt-4 mt-4 border-t border-slate-200">
                <button
                  onClick={handleBackToTournaments}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-slate-600 hover:bg-slate-50 active:bg-slate-100 touch-manipulation"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Tournaments</span>
                </button>
                
                <div className="px-4 py-2 text-sm text-slate-600 font-medium mt-2">
                  👤 {user?.firstName} {user?.lastName}
                </div>
                <div className="px-4 py-1 text-xs text-slate-500">@{user?.username}</div>
                <button
                  onClick={() => { handleLogout(); closeMenu(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-red-600 hover:bg-red-50 active:bg-red-100 mt-2 touch-manipulation"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation - Single Row with 5 Items */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl z-40">
        <div className="grid grid-cols-5 gap-0 px-1 py-2">
          <BottomNavLink 
            to={`/tournament/${selectedTournament?.tournamentId}`} 
            icon={Home} 
            label="Home" 
            active={isActive(`/tournament/${selectedTournament?.tournamentId}`)} 
          />
          <BottomNavLink 
            to={`/tournament/${selectedTournament?.tournamentId}/matches`} 
            icon={Calendar} 
            label="Matches" 
            active={isActive(`/tournament/${selectedTournament?.tournamentId}/matches`)} 
          />
          <BottomNavLink 
            to={`/tournament/${selectedTournament?.tournamentId}/teams`} 
            icon={Users} 
            label="Teams" 
            active={isActive(`/tournament/${selectedTournament?.tournamentId}/teams`)} 
          />
          <BottomNavLink 
            to={`/tournament/${selectedTournament?.tournamentId}/groups`} 
            icon={FolderOpen} 
            label="Groups" 
            active={isActive(`/tournament/${selectedTournament?.tournamentId}/groups`)} 
          />
          <BottomNavLink 
            to={`/tournament/${selectedTournament?.tournamentId}/standings`} 
            icon={BarChart3} 
            label="Stats" 
            active={isActive(`/tournament/${selectedTournament?.tournamentId}/standings`)} 
          />
        </div>
      </nav>
    </div>
  );
}

function NavLink({ to, icon: Icon, label, active }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all touch-manipulation ${
        active 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
          : 'text-slate-600 hover:bg-indigo-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon: Icon, label, active, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all touch-manipulation ${
        active 
          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
          : 'text-slate-600 hover:bg-indigo-50 active:bg-indigo-100'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}

function BottomNavLink({ to, icon: Icon, label, active }) {
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-lg transition-all touch-manipulation ${
        active 
          ? 'text-indigo-600' 
          : 'text-slate-400 active:bg-slate-100'
      }`}
    >
      <Icon className={`w-5 h-5 mb-0.5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
      <span className={`text-[10px] font-medium leading-tight ${active ? 'text-indigo-600' : 'text-slate-500'}`}>
        {label}
      </span>
    </Link>
  );
}