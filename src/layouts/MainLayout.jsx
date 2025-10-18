import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Trophy, Users, Calendar, BarChart3, User, LogOut, Home } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20 lg:pb-0">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-lg shadow-indigo-500/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Easy Pickle</h1>
                <p className="text-xs text-slate-500 font-medium">Tournament Manager</p>
              </div>
            </Link>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="lg:hidden p-2 rounded-xl hover:bg-indigo-50 active:bg-indigo-100 touch-manipulation"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6 text-indigo-600" /> : <Menu className="w-6 h-6 text-indigo-600" />}
            </button>
            
            {/* Desktop Navigation */}
            {/* <div className="hidden lg:flex items-center gap-4">
              <nav className="flex gap-2">
                <NavLink to="/" icon={Trophy} label="Tournaments" active={isActive('/')} />
                <NavLink to="/teams" icon={Users} label="Teams" active={isActive('/teams')} />
                <NavLink to="/players" icon={User} label="Players" active={isActive('/players')} />
                <NavLink to="/matches" icon={Calendar} label="Matches" active={isActive('/matches')} />
                <NavLink to="/standings" icon={BarChart3} label="Standings" active={isActive('/standings')} />
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
            </div> */}
          </div>
          
          {/* Mobile Menu Dropdown */}
          {/* {menuOpen && (
            <nav className="lg:hidden mt-4 pb-2 space-y-1 animate-slideDown">
              <MobileNavLink to="/" icon={Home} label="Home" active={isActive('/')} onClick={closeMenu} />
              <MobileNavLink to="/teams" icon={Users} label="Teams" active={isActive('/teams')} onClick={closeMenu} />
              <MobileNavLink to="/players" icon={User} label="Players" active={isActive('/players')} onClick={closeMenu} />
              <MobileNavLink to="/matches" icon={Calendar} label="Matches" active={isActive('/matches')} onClick={closeMenu} />
              <MobileNavLink to="/standings" icon={BarChart3} label="Standings" active={isActive('/standings')} onClick={closeMenu} />
              
              <div className="pt-4 mt-4 border-t border-slate-200">
                <div className="px-4 py-2 text-sm text-slate-600 font-medium">
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
          )} */}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-4 py-6 max-w-7xl mx-auto">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {/* <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl z-40">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          <BottomNavLink to="/" icon={Home} label="Home" active={isActive('/')} />
          <BottomNavLink to="/teams" icon={Users} label="Teams" active={isActive('/teams')} />
          <BottomNavLink to="/matches" icon={Calendar} label="Matches" active={isActive('/matches')} />
          <BottomNavLink to="/standings" icon={BarChart3} label="Stats" active={isActive('/standings')} />
          <BottomNavLink to="/players" icon={User} label="Players" active={isActive('/players')} />
        </div>
      </nav> */}
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
      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all touch-manipulation ${
        active 
          ? 'text-indigo-600' 
          : 'text-slate-400 active:bg-slate-100'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
      <span className={`text-xs font-medium ${active ? 'text-indigo-600' : 'text-slate-500'}`}>
        {label}
      </span>
    </Link>
  );
}