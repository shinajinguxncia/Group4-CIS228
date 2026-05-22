import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LockKeyhole, Mic, Plus, Search, Sparkles } from 'lucide-react';
import {
  JOURNAL_ENTRIES_KEY,
  moodEmojis,
  type JournalEntry,
} from '../../../types/journal';
import { MASK_OFF_ENTRIES_KEY, maskOffMoods, type MaskOffEntry } from '../../maskoff/data/maskOffConfig';

const mockEntries: JournalEntry[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'Grateful for small things',
    content: 'My friend sent me a random text today saying they were thinking of me.',
    mood: 'grateful',
    voice_url: null,
    voice_duration: null,
    is_mask_off: false,
    created_at: '2026-05-06T08:50:00Z',
    updated_at: '2026-05-06T08:50:00Z',
  },
  {
    id: '2',
    user_id: 'user1',
    title: 'Feeling overwhelmed',
    content: 'Too many things coming up on my plate right now.',
    mood: 'anxious',
    voice_url: null,
    voice_duration: null,
    is_mask_off: false,
    created_at: '2026-05-06T08:50:00Z',
    updated_at: '2026-05-06T08:50:00Z',
  },
];

type UnifiedEntry = {
  id: string;
  title: string;
  content: string;
  moodLabel: string | null;
  moodEmoji: string | null;
  isMaskOff: boolean;
  createdAt: string;
  route: string;
};

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [normalEntries, setNormalEntries] = useState<JournalEntry[]>(mockEntries);
  const [maskOffEntries, setMaskOffEntries] = useState<MaskOffEntry[]>([]);

  useEffect(() => {
    const storedJournal = localStorage.getItem(JOURNAL_ENTRIES_KEY);
    if (storedJournal) {
      setNormalEntries([...JSON.parse(storedJournal), ...mockEntries]);
    }

    const storedMaskOff = localStorage.getItem(MASK_OFF_ENTRIES_KEY);
    if (storedMaskOff) {
      setMaskOffEntries(JSON.parse(storedMaskOff) as MaskOffEntry[]);
    }
  }, []);

  const unifiedEntries = useMemo<UnifiedEntry[]>(() => {
    const journal = normalEntries.map((entry) => ({
      id: entry.id,
      title: entry.title || 'Untitled entry',
      content: entry.content || '',
      moodLabel: entry.mood,
      moodEmoji: entry.mood ? moodEmojis[entry.mood] : null,
      isMaskOff: false,
      createdAt: entry.created_at,
      route: `/entry/${entry.id}`,
    }));

    const maskOff = maskOffEntries.map((entry) => {
      const mood = maskOffMoods.find((item) => item.id === entry.mood);
      return {
        id: entry.id,
        title: entry.title || 'Untitled truth',
        content: entry.content || entry.summary || '',
        moodLabel: mood?.label ?? null,
        moodEmoji: mood?.emoji ?? null,
        isMaskOff: true,
        createdAt: entry.createdAt,
        route: `/maskoff-detail/${entry.id}`,
      };
    });

    return [...maskOff, ...journal].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [maskOffEntries, normalEntries]);

  const filtered = unifiedEntries.filter((entry) => {
    const query = searchQuery.toLowerCase();
    return (
      entry.title.toLowerCase().includes(query) ||
      entry.content.toLowerCase().includes(query) ||
      entry.moodLabel?.toLowerCase().includes(query)
    );
  });

  const thisWeekCount = unifiedEntries.filter((entry) => {
    const created = new Date(entry.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return created >= sevenDaysAgo;
  }).length;

  const privateCount = unifiedEntries.filter((entry) => entry.isMaskOff).length;

  return (
    <div className="font-maskoff px-4 pb-6">
      <section className="pt-6">
        <h1 className="font-cute-display text-4xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          MabuhAi
        </h1>
        <p className="mt-1 text-sm text-gray-400 dark:text-slate-400">Your thoughts are safe here</p>
      </section>

      <section className="mt-5 grid grid-cols-3 gap-3">
        <DashboardStat label="Total" value={unifiedEntries.length} />
        <DashboardStat label="This week" value={thisWeekCount} />
        <DashboardStat label="Private" value={privateCount} />
      </section>

      <button
        type="button"
        onClick={() => navigate('/new')}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:scale-[1.01] active:scale-[0.99]"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        Record new thought
      </button>

      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search normal and Mask-Off entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl bg-white px-9 py-3 text-sm shadow-sm border border-gray-100 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-purple-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-cute-display text-lg text-gray-800 dark:text-slate-100">Entries</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">{filtered.length} shown</p>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 py-16 text-center dark:border-slate-700">
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-slate-500" />
              <p className="text-gray-400 dark:text-slate-400">No entries found</p>
            </div>
          ) : (
            filtered.map((entry) => (
              <button
                type="button"
                key={`${entry.isMaskOff ? 'maskoff' : 'journal'}-${entry.id}`}
                onClick={() => navigate(entry.route)}
                className="w-full rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className={`font-cute-display text-base ${entry.isMaskOff ? 'blur-sm text-gray-400 dark:text-slate-500' : 'text-gray-800 dark:text-slate-100'}`}>{entry.title}</h3>
                  <div className="flex shrink-0 items-center gap-2">
                    {entry.isMaskOff && (
                      <span className="rounded-full bg-slate-900 px-2 py-1 text-xs text-white dark:bg-slate-100 dark:text-slate-950">
                        <LockKeyhole className="mr-1 inline h-3 w-3" aria-hidden="true" />
                        Private
                      </span>
                    )}
                    {entry.moodEmoji && (
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900 dark:text-purple-200">
                        {entry.moodEmoji} {entry.moodLabel}
                      </span>
                    )}
                  </div>
                </div>
                <p className={`line-clamp-2 text-sm ${entry.isMaskOff ? 'blur-sm text-gray-400 dark:text-slate-500' : 'text-gray-600 dark:text-slate-300'}`}>{entry.content}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-slate-400">
                    {new Date(entry.createdAt).toLocaleDateString()} · {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!entry.isMaskOff && <Mic className="h-3 w-3 text-gray-400" />}
                </div>
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function DashboardStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <Sparkles className="mb-2 h-4 w-4 text-purple-500" aria-hidden="true" />
      <p className="font-cute-display text-2xl text-gray-900 dark:text-slate-50">{value}</p>
      <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
    </div>
  );
}
