import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Plus, Palette } from 'lucide-react';

const themes = [
  { name: 'Midnight', color: 'bg-slate-900', text: 'text-white', border: 'border-slate-700', emoji: '🌙' },
  { name: 'Forest', color: 'bg-emerald-900', text: 'text-white', border: 'border-emerald-800', emoji: '🌲' },
  { name: 'Dusk', color: 'bg-purple-900', text: 'text-white', border: 'border-purple-800', emoji: '🌆' },
  { name: 'Crimson', color: 'bg-rose-900', text: 'text-white', border: 'border-rose-800', emoji: '🌹' },
  { name: 'Ocean', color: 'bg-blue-900', text: 'text-white', border: 'border-blue-800', emoji: '🌊' },
  { name: 'Sand', color: 'bg-amber-900', text: 'text-white', border: 'border-amber-800', emoji: '🏜️' },
];

export function MaskOffPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);

  // Check if coming back from entry form
  useEffect(() => {
    if (location.state?.fromEntry) {
      setIsUnlocked(true);
    }
  }, [location]);

  useEffect(() => {
    const stored = localStorage.getItem('maskoff_pin');
    if (stored) setSavedPin(stored);
    
    const savedTheme = localStorage.getItem('maskoff_theme');
    if (savedTheme) {
      const theme = themes.find(t => t.name === savedTheme);
      if (theme) setSelectedTheme(theme);
    }
  }, []);

  const handleSetPin = () => {
    if (pin.length >= 4) {
      localStorage.setItem('maskoff_pin', pin);
      setSavedPin(pin);
      setIsUnlocked(true);
    }
  };

  const handleUnlock = () => {
    if (pin === savedPin) {
      setIsUnlocked(true);
    } else {
      alert('Wrong PIN');
    }
  };

  const handleThemeChange = (theme: typeof themes[0]) => {
    setSelectedTheme(theme);
    localStorage.setItem('maskoff_theme', theme.name);
  };

  // PIN Screen
  if (!isUnlocked) {
    return (
      <div className={`min-h-screen ${selectedTheme.color} ${selectedTheme.text} flex items-center justify-center p-6`}>
        <div className="text-center max-w-sm w-full">
          <Shield className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-2xl font-serif font-bold mb-2">Create Your PIN</h1>
          <p className="text-sm opacity-70 mb-6">Set a PIN to protect your private thoughts.</p>
          <input
            type="password"
            maxLength={6}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-center text-2xl tracking-wider mb-4 focus:outline-none focus:ring-2 focus:ring-white/50"
          />
          <button
            onClick={savedPin ? handleUnlock : handleSetPin}
            className="w-full py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition"
          >
            {savedPin ? 'Unlock' : 'Set PIN'}
          </button>
          <p className="text-xs opacity-50 mt-4">Your PIN is stored locally on this device only.</p>
        </div>
      </div>
    );
  }

  // Unlocked Mask-Off Mode
  return (
    <div className={`min-h-screen ${selectedTheme.color} ${selectedTheme.text}`}>
      <div className="px-4 pt-6 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-serif font-bold">Mask-Off Mode</h1>
            <p className="text-sm opacity-70 mt-1">Your private, judgment-free space</p>
          </div>
          <button onClick={() => setIsUnlocked(false)} className="p-2 hover:bg-white/10 rounded-full">
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4" />
          <span className="text-sm">Choose your theme</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {themes.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleThemeChange(theme)}
              className={`w-12 h-12 rounded-full ${theme.color} border-2 transition 
                ${selectedTheme.name === theme.name ? 'border-white scale-110' : 'border-white/30'}`}
              title={theme.name}
            >
              <span className="text-xl">{theme.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm mb-6">
        <p className="text-sm text-center">🔒 Everything here is extra private. No AI reads this. No one judges.</p>
      </div>

      <div className="px-4">
        <button
          onClick={() => navigate('/new-maskoff', { state: { theme: selectedTheme, fromMaskOff: true } })}
          className="w-full py-4 border-2 border-dashed border-white/30 rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Mask-Off Entry
        </button>
      </div>

      <div className="px-4 mt-6 space-y-3">
        <p className="text-sm opacity-50 text-center">Your private entries will appear here</p>
      </div>
    </div>
  );
}