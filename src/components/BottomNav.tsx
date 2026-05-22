import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Shield } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-gray-100 dark:border-slate-800 py-2 px-6 z-50">
      <div className="flex justify-around items-center max-w-sm mx-auto">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-full transition-all
            ${isActive('/') ? 'text-purple-600' : 'text-gray-400 dark:text-slate-500 hover:text-purple-400'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => navigate('/maskoff')}
          className={`flex flex-col items-center gap-1 py-2 px-4 rounded-full transition-all
            ${isActive('/maskoff') ? 'text-purple-600' : 'text-gray-400 dark:text-slate-500 hover:text-purple-400'}`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-xs">Mask-Off</span>
        </button>
      </div>
    </div>
  );
}
