import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, ShieldCheck } from 'lucide-react';
import { getMaskOffTheme, MASK_OFF_ENTRIES_KEY, MASK_OFF_PIN_KEY, maskOffMoods, type MaskOffEntry, type MaskOffTheme } from '../data/maskOffConfig';

export function MaskOffDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [entry, setEntry] = useState<MaskOffEntry | null>(null);
  const themeId = (location.state as any)?.themeId || localStorage.getItem('maskoff-theme');
  const [theme, setTheme] = useState<MaskOffTheme>(getMaskOffTheme(themeId));
  const [isLoading, setIsLoading] = useState(true);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [savedPin, setSavedPin] = useState<string | null>(null);

  useEffect(() => {
    const storedEntries = localStorage.getItem(MASK_OFF_ENTRIES_KEY);
    if (storedEntries) {
      const entries = JSON.parse(storedEntries) as MaskOffEntry[];
      const found = entries.find((e) => e.id === id);
      setEntry(found || null);
    }
    setSavedPin(localStorage.getItem(MASK_OFF_PIN_KEY));
    setIsLoading(false);
  }, [id]);

  const handleUnlock = () => {
    if (pin === savedPin) {
      setIsUnlocked(true);
      setPin('');
      return;
    }
    alert('Wrong PIN');
  };

  if (isLoading || !entry) {
    return (
      <div className={`min-h-screen ${theme.pageClass}`}>
        <div className="flex items-center justify-center min-h-screen">
          <p className={`text-sm ${theme.mutedTextClass}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className={`min-h-screen ${theme.pageClass}`}>
        <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
          <div className={`w-full max-w-sm rounded-3xl border p-6 text-center ${theme.panelClass}`}>
            <ShieldCheck className="mx-auto mb-4 h-14 w-14 opacity-80" aria-hidden="true" />
            <h1 className="font-cute-display text-2xl">Unlock Entry</h1>
            <p className={`mt-2 text-sm ${theme.mutedTextClass}`}>
              Enter your PIN to view this private entry.
            </p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(event) => setPin(event.target.value)}
              placeholder="Enter PIN"
              className="mt-6 w-full rounded-2xl border border-white/40 bg-white/70 p-3 text-center text-2xl tracking-[0.35em] text-slate-950 outline-none focus:ring-2 focus:ring-current"
              aria-label="Mask-Off PIN"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUnlock();
                }
              }}
            />
            <button
              type="button"
              onClick={handleUnlock}
              className={`mt-4 w-full rounded-2xl px-4 py-3 font-semibold transition hover:scale-[1.01] ${theme.accentClass}`}
            >
              Unlock
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className={`mt-3 w-full rounded-2xl px-4 py-3 font-semibold transition hover:scale-[1.01] ${theme.panelClass} ${theme.textClass}`}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mood = maskOffMoods.find((item) => item.id === entry.mood);
  const formattedDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this entry?')) {
      const storedEntries = localStorage.getItem(MASK_OFF_ENTRIES_KEY);
      if (storedEntries) {
        const entries = JSON.parse(storedEntries) as MaskOffEntry[];
        const filtered = entries.filter((e) => e.id !== id);
        localStorage.setItem(MASK_OFF_ENTRIES_KEY, JSON.stringify(filtered));
      }
      navigate('/maskoff');
    }
  };

  const handleEdit = () => {
    navigate(`/new-maskoff`, { state: { entryId: id, themeId: theme.id, fromMaskOff: true } });
  };

  return (
    <div className={`min-h-screen ${theme.pageClass}`}>
      <div className="relative z-10">
        {/* Header */}
        <nav className={`sticky top-0 z-10 border-b backdrop-blur ${theme.panelClass} ${theme.borderClass}`}>
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-4">
            <button
              type="button"
              onClick={() => navigate('/maskoff')}
              className={`rounded-full border p-2 transition hover:scale-[1.05] ${theme.panelClass}`}
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <h1 className="font-cute-display text-lg flex-1">Entry Detail</h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleEdit}
                className={`rounded-full border p-2 transition hover:scale-[1.05] ${theme.panelClass}`}
                aria-label="Edit entry"
              >
                <Edit className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className={`rounded-full border p-2 transition hover:scale-[1.05] ${theme.panelClass}`}
                aria-label="Delete entry"
              >
                <Trash2 className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 pb-24">
          {/* Mood Badge */}
          {mood && (
            <div className="flex gap-2">
              <span className={`rounded-full px-3 py-1 text-sm ${theme.accentClass}`}>
                {mood.emoji} {mood.label}
              </span>
              <span className={`rounded-full border px-3 py-1 text-sm ${theme.borderClass}`}>
                Intensity {entry.intensity}/10
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <h2 className="font-cute-display text-3xl sm:text-4xl">{entry.title || 'Untitled truth'}</h2>
            <p className={`mt-2 text-sm ${theme.mutedTextClass}`}>{formattedDate}</p>
          </div>

          {/* Content */}
          <section className={`rounded-2xl border p-6 ${theme.panelClass}`}>
            <h3 className="font-cute-display text-lg mb-4">Your thoughts</h3>
            <p className={`whitespace-pre-wrap leading-relaxed ${theme.textClass}`}>{entry.content}</p>
          </section>

          {/* Summary */}
          {entry.summary && (
            <section className={`rounded-2xl border p-6 ${theme.panelClass}`}>
              <h3 className="font-cute-display text-lg mb-4">Summary</h3>
              <p className={`${theme.textClass}`}>{entry.summary}</p>
            </section>
          )}

          {/* Cognitive Distortion & Reframe */}
          <div className="grid gap-6 sm:grid-cols-2">
            {entry.cognitiveDistortion && (
              <section className={`rounded-2xl border p-6 ${theme.panelClass}`}>
                <h3 className="font-cute-display text-lg mb-4">Cognitive Distortion</h3>
                <p className={`${theme.textClass}`}>{entry.cognitiveDistortion}</p>
              </section>
            )}
            {entry.reframe && (
              <section className={`rounded-2xl border p-6 ${theme.panelClass}`}>
                <h3 className="font-cute-display text-lg mb-4">Reframe</h3>
                <p className={`${theme.textClass}`}>{entry.reframe}</p>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
