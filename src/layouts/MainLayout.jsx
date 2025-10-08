import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Trophy, Users, Calendar, BarChart3, User, LogOut } from 'lucide-react';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-lg shadow-indigo-500/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Easy Pickle</h1>
                <p className="text-xs text-slate-500 font-medium">Tournament Management</p>
              </div>
            </Link>
            
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-xl hover:bg-indigo-50">
              {menuOpen ? <X className="w-6 h-6 text-indigo-600" /> : <Menu className="w-6 h-6 text-indigo-600" />}
            </button>
            
            <div className="hidden lg:flex items-center gap-4">
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
            </div>
          </div>
          
          {menuOpen && (
            <nav className="lg:hidden mt-4 pb-2 space-y-1">
              <MobileNavLink to="/" icon={Trophy} label="Tournaments" active={isActive('/')} onClick={() => setMenuOpen(false)} />
              <MobileNavLink to="/teams" icon={Users} label="Teams" active={isActive('/teams')} onClick={() => setMenuOpen(false)} />
              <MobileNavLink to="/players" icon={User} label="Players" active={isActive('/players')} onClick={() => setMenuOpen(false)} />
              <MobileNavLink to="/matches" icon={Calendar} label="Matches" active={isActive('/matches')} onClick={() => setMenuOpen(false)} />
              <MobileNavLink to="/standings" icon={BarChart3} label="Standings" active={isActive('/standings')} onClick={() => setMenuOpen(false)} />
              
              <div className="pt-4 mt-4 border-t border-slate-200">
                <div className="px-4 py-2 text-sm text-slate-600 font-medium">Welcome, {user?.username}</div>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({ to, icon: Icon, label, active }) {
  return (
    <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${active ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' : 'text-slate-600 hover:bg-indigo-50'}`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}

function MobileNavLink({ to, icon: Icon, label, active, onClick }) {
  return (
    <Link to={to} onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${active ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' : 'text-slate-600 hover:bg-indigo-50'}`}>
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}