import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'text-green-400 font-semibold'
      : 'text-gray-300 hover:text-white';

  return (
    <nav style={{backgroundColor: '#052e16'}}
         className="shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center
                        justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-500 p-2 rounded-full">
              <span className="text-white text-sm">🌿</span>
            </div>
            <div>
              <span className="text-white font-bold text-lg">
                Carbon Scope
              </span>
              <p className="text-green-400 text-xs">
                Digital Footprint Intelligence
              </p>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link to="/"
              className={`text-sm ${isActive('/')}`}>
              🔍 Analyze
            </Link>
            <Link to="/history"
              className={`text-sm ${isActive('/history')}`}>
              📋 History
            </Link>
            <Link to="/compare"
              className={`text-sm ${isActive('/compare')}`}>
              ⚖️ Compare
            </Link>
            <Link to="/leaderboard"
              className={`text-sm ${isActive('/leaderboard')}`}>
              🏆 Leaderboard
            </Link>
          </div>

        </div>
      </div>
    </nav>
  );
}