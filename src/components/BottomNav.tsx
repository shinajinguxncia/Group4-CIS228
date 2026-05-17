import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Plus, Shield } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 py-2 px-6 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {/* Home Button */}
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-full transition-all
            ${isActive('/') ? 'text-purple-600' : 'text-gray-400 hover:text-purple-400'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </button>

        {/* New Entry Button - STAND OUT */}
        <button
          onClick={() => navigate('/new')}
          className="flex flex-col items-center gap-1 py-2 px-5 rounded-full transition-all
            bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg
            hover:shadow-xl hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="text-xs font-medium">New Entry</span>
        </button>

        {/* Mask-Off Button */}
        <button
          onClick={() => navigate('/maskoff')}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-full transition-all
            ${isActive('/maskoff') ? 'text-purple-600' : 'text-gray-400 hover:text-purple-400'}`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-xs">Mask-Off</span>
        </button>
      </div>
    </div>
  );
}