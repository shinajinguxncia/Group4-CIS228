import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CalendarDays, LockKeyhole, Mic, Plus, Search, Sparkles } from 'lucide-react';
import { loadUnifiedEntries, type UnifiedEntry } from '../data/entries';

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [unifiedEntries] = useState<UnifiedEntry[]>(loadUnifiedEntries);

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

      <CalendarShortcut entries={unifiedEntries} onClick={() => navigate('/mood-calendar')} />

      <motion.button
        type="button"
        onClick={() => navigate('/new')}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 420, damping: 26 }}
        className="smooth-press mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition hover:shadow-purple-500/30"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        Record new thought
      </motion.button>

      <div className="relative mt-5">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Search normal and Mask-Off entries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="smooth-field w-full rounded-2xl bg-white px-9 py-3 text-sm shadow-sm border border-gray-100 outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-purple-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </div>

      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-cute-display text-lg text-gray-800 dark:text-slate-100">Entries</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400">{filtered.length} shown</p>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-dashed border-gray-200 py-16 text-center dark:border-slate-700"
            >
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-gray-300 dark:text-slate-500" />
              <p className="text-gray-400 dark:text-slate-400">No entries found</p>
            </motion.div>
          ) : (
            filtered.map((entry) => (
              <motion.button
                type="button"
                key={`${entry.isMaskOff ? 'maskoff' : 'journal'}-${entry.id}`}
                layout
                initial={{ opacity: 0, y: 10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -3, scale: 1.01 }}
                whileTap={{ scale: 0.985, y: 0 }}
                transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                onClick={() => navigate(entry.route)}
                className="smooth-card w-full rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-sm transition dark:border-slate-700 dark:bg-slate-800"
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
                <p className={`line-clamp-2 text-sm ${entry.isMaskOff ? 'text-gray-400 dark:text-slate-500' : 'text-gray-600 dark:text-slate-300'} ${entry.blurContent ? 'select-none blur-sm' : entry.isMaskOff ? 'blur-sm' : ''}`}>
                  {entry.content || 'No written content yet.'}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-gray-400 dark:text-slate-400">
                    {new Date(entry.createdAt).toLocaleDateString()} · {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!entry.isMaskOff && <Mic className="h-3 w-3 text-gray-400" />}
                </div>
              </motion.button>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function CalendarShortcut({ entries, onClick }: { entries: UnifiedEntry[]; onClick: () => void }) {
  const recentEmojis = Array.from(new Set(entries.map((entry) => entry.moodEmoji).filter(Boolean))).slice(0, 4);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="smooth-card mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border border-purple-100 bg-white/90 p-3 text-left shadow-sm dark:border-slate-700 dark:bg-slate-800/90"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-900/70 dark:text-purple-200">
          <CalendarDays className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-gray-800 dark:text-slate-100">Mood calendar</span>
          <span className="block truncate text-xs text-gray-500 dark:text-slate-400">Open monthly mood tracker</span>
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        {recentEmojis.length > 0 ? (
          recentEmojis.map((emoji) => (
            <span key={emoji} className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-50 text-sm dark:bg-purple-950/60">
              {emoji}
            </span>
          ))
        ) : (
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-400 dark:bg-slate-900 dark:text-slate-500">
            No moods
          </span>
        )}
      </span>
    </motion.button>
  );
}

function DashboardStat({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      className="smooth-card rounded-2xl border border-purple-100 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <Sparkles className="mb-2 h-4 w-4 text-purple-500" aria-hidden="true" />
      <p className="font-cute-display text-2xl text-gray-900 dark:text-slate-50">{value}</p>
      <p className="text-xs text-gray-500 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}
