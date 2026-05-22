import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, LockKeyhole } from 'lucide-react';
import { getDateKey, loadUnifiedEntries, type UnifiedEntry } from '../data/entries';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function MoodCalendarPage() {
  const navigate = useNavigate();
  const [entries] = useState<UnifiedEntry[]>(loadUnifiedEntries);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(() => getDateKey(new Date()));
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const todayKey = getDateKey(new Date());

  const entriesByDate = useMemo(() => {
    return entries.reduce<Record<string, UnifiedEntry[]>>((acc, entry) => {
      const key = getDateKey(new Date(entry.createdAt));
      acc[key] = [...(acc[key] ?? []), entry];
      return acc;
    }, {});
  }, [entries]);

  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1));

    return [...blanks, ...days];
  }, [month, year]);

  const selectedEntries = entriesByDate[selectedDateKey] ?? [];
  const monthLabel = visibleMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const selectedDateLabel = new Date(`${selectedDateKey}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const changeMonth = (amount: number) => {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  };

  return (
    <main className="font-maskoff mx-auto max-w-2xl px-4 pb-28 pt-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="smooth-press inline-flex items-center gap-2 rounded-full border border-purple-100 bg-white px-3 py-2 text-sm font-semibold text-purple-700 shadow-sm hover:bg-purple-50 dark:border-slate-700 dark:bg-slate-800 dark:text-purple-200 dark:hover:bg-purple-950/40"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="smooth-press rounded-full border border-purple-100 bg-white p-2 text-gray-500 shadow-sm hover:bg-purple-50 hover:text-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="smooth-press rounded-full border border-purple-100 bg-white p-2 text-gray-500 shadow-sm hover:bg-purple-50 hover:text-purple-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <section className="smooth-card rounded-3xl border border-purple-100 bg-white/92 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/92">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 dark:bg-purple-900/70 dark:text-purple-200">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h1 className="font-cute-display text-2xl text-gray-900 dark:text-slate-50">Mood calendar</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">{monthLabel}</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[0.68rem] font-semibold uppercase text-gray-400 dark:text-slate-500">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {calendarCells.map((date, index) => {
            if (!date) {
              return <div key={`blank-${index}`} className="aspect-square" />;
            }

            const dateKey = getDateKey(date);
            const dayEntries = entriesByDate[dateKey] ?? [];
            const dayEmojis = Array.from(
              new Set(dayEntries.map((entry) => entry.moodEmoji).filter((emoji): emoji is string => Boolean(emoji)))
            ).slice(0, 3);
            const isToday = dateKey === todayKey;
            const isSelected = dateKey === selectedDateKey;

            return (
              <motion.button
                key={dateKey}
                type="button"
                whileHover={{ y: -2, scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                onClick={() => setSelectedDateKey(dateKey)}
                className={`smooth-card flex aspect-square min-h-11 flex-col items-center justify-between rounded-2xl border p-1.5 text-center ${
                  dayEntries.length > 0
                    ? 'border-purple-200 bg-purple-50 text-purple-900 shadow-sm dark:border-purple-700 dark:bg-purple-950/50 dark:text-purple-100'
                    : 'border-gray-100 bg-gray-50/70 text-gray-400 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-500'
                } ${isToday ? 'ring-2 ring-purple-400/50' : ''} ${isSelected ? 'scale-[1.03] border-purple-400 shadow-md shadow-purple-500/10' : ''}`}
                aria-label={`${date.toLocaleDateString()} ${dayEntries.length} entries`}
              >
                <span className="self-start text-[0.68rem] font-bold">{date.getDate()}</span>
                <span className="flex min-h-5 items-center justify-center gap-0.5 text-sm leading-none sm:text-base">
                  {dayEmojis.map((emoji) => <span key={emoji}>{emoji}</span>)}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>

      <section className="smooth-card mt-4 rounded-3xl border border-purple-100 bg-white/92 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800/92">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-cute-display text-lg text-gray-900 dark:text-slate-50">{selectedDateLabel}</h2>
          <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/70 dark:text-purple-200">
            {selectedEntries.length} entries
          </span>
        </div>

        {selectedEntries.length > 0 ? (
          <div className="space-y-2">
            {selectedEntries.map((entry) => (
              <button
                key={`${entry.isMaskOff ? 'maskoff' : 'journal'}-${entry.id}`}
                type="button"
                onClick={() => navigate(entry.route)}
                className="smooth-card flex w-full items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50/70 p-3 text-left dark:border-slate-700 dark:bg-slate-900/70"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xl shadow-sm dark:bg-slate-800">
                  {entry.moodEmoji ?? '-'}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-slate-100">
                    {entry.title}
                  </span>
                  <span className="block truncate text-xs text-gray-500 dark:text-slate-400">
                    {entry.moodLabel ?? 'No mood'} {entry.isMaskOff ? '- Mask-Off' : ''}
                  </span>
                </span>
                {entry.isMaskOff && <LockKeyhole className="h-4 w-4 text-gray-400" aria-hidden="true" />}
              </button>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-gray-200 p-6 text-center text-sm text-gray-400 dark:border-slate-700 dark:text-slate-500">
            No entries for this day yet.
          </p>
        )}
      </section>
    </main>
  );
}
