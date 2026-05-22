import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Shield } from 'lucide-react';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isMaskOffActive = location.pathname.includes('maskoff');
  const isHomeActive = !isMaskOffActive;

  return (
    <nav className="fixed bottom-3 left-3 right-3 z-50 rounded-3xl border border-white/70 bg-white/92 px-4 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/92">
      <div className="mx-auto flex max-w-sm items-center justify-around">
        <button
          onClick={() => navigate('/')}
          className={`smooth-press flex flex-col items-center gap-1 rounded-full px-4 py-2 transition-all duration-300
            ${isHomeActive ? 'bg-purple-50 text-purple-600 shadow-sm dark:bg-purple-950/50' : 'text-gray-400 dark:text-slate-500 hover:bg-purple-50/70 hover:text-purple-400 dark:hover:bg-purple-950/30'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => navigate('/maskoff')}
          className={`smooth-press flex flex-col items-center gap-1 rounded-full px-4 py-2 transition-all duration-300
            ${isMaskOffActive ? 'bg-purple-50 text-purple-600 shadow-sm dark:bg-purple-950/50' : 'text-gray-400 dark:text-slate-500 hover:bg-purple-50/70 hover:text-purple-400 dark:hover:bg-purple-950/30'}`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-xs">Mask-Off</span>
        </button>
      </div>
    </nav>
  );
}
