import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Shield } from 'lucide-react';
import {
  getMaskOffTheme,
  MASK_OFF_THEME_CHANGE_EVENT,
  MASK_OFF_THEME_KEY,
} from '../features/maskoff/data/maskOffConfig';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [maskOffTheme, setMaskOffTheme] = useState(() =>
    getMaskOffTheme(localStorage.getItem(MASK_OFF_THEME_KEY))
  );

  const isMaskOffActive = location.pathname.includes('maskoff');
  const isHomeActive = !isMaskOffActive;
  const themedNavClass = isMaskOffActive
    ? `${maskOffTheme.panelClass} ${maskOffTheme.textClass}`
    : 'border-white/70 bg-white/92 shadow-slate-900/10 dark:border-slate-700/80 dark:bg-slate-950/92';
  const inactiveMaskOffClass = `${maskOffTheme.mutedTextClass} hover:bg-white/25 dark:hover:bg-white/10`;
  const defaultInactiveClass = 'text-gray-400 dark:text-slate-500 hover:bg-purple-50/70 hover:text-purple-400 dark:hover:bg-purple-950/30';

  useEffect(() => {
    const syncTheme = () => {
      setMaskOffTheme(getMaskOffTheme(localStorage.getItem(MASK_OFF_THEME_KEY)));
    };

    const handleThemeChange = (event: Event) => {
      const themeId = event instanceof CustomEvent && typeof event.detail === 'string'
        ? event.detail
        : localStorage.getItem(MASK_OFF_THEME_KEY);

      setMaskOffTheme(getMaskOffTheme(themeId));
    };

    syncTheme();
    window.addEventListener('storage', syncTheme);
    window.addEventListener(MASK_OFF_THEME_CHANGE_EVENT, handleThemeChange);

    return () => {
      window.removeEventListener('storage', syncTheme);
      window.removeEventListener(MASK_OFF_THEME_CHANGE_EVENT, handleThemeChange);
    };
  }, [location.pathname]);

  return (
    <nav className={`fixed bottom-3 left-3 right-3 z-50 rounded-3xl border px-4 py-2 shadow-2xl backdrop-blur-xl ${themedNavClass}`}>
      <div className="mx-auto flex max-w-sm items-center justify-around">
        <button
          onClick={() => navigate('/')}
          className={`smooth-press flex flex-col items-center gap-1 rounded-full px-4 py-2 transition-all duration-300
            ${isHomeActive ? 'bg-purple-50 text-purple-600 shadow-sm dark:bg-purple-950/50' : isMaskOffActive ? inactiveMaskOffClass : defaultInactiveClass}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => navigate('/maskoff')}
          className={`smooth-press flex flex-col items-center gap-1 rounded-full px-4 py-2 transition-all duration-300
            ${isMaskOffActive ? maskOffTheme.accentClass : defaultInactiveClass}`}
        >
          <Shield className="w-5 h-5" />
          <span className="text-xs">Mask-Off</span>
        </button>
      </div>
    </nav>
  );
}
