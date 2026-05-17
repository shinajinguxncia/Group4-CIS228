import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, BookOpen } from 'lucide-react';
import { moodEmojis, type JournalEntry } from '../../../types/journal';

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

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [entries] = useState(mockEntries);

  const filtered = entries.filter(e =>
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="px-4 pt-6 pb-3">
        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          MabuhAi
        </h1>
        <p className="text-gray-400 text-sm mt-1">Your thoughts are safe here ✨</p>
        
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search your entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <p className="text-sm text-gray-500">{filtered.length} entries</p>
      </div>

      <div className="px-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No entries yet</p>
          </div>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              onClick={() => navigate(`/entry/${entry.id}`)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{entry.title}</h3>
                {entry.mood && (
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                    {moodEmojis[entry.mood]} {entry.mood}
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm line-clamp-2">{entry.content}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-400">
                  {new Date(entry.created_at).toLocaleDateString()} · {new Date(entry.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </span>
                {entry.voice_url && <Mic className="w-3 h-3 text-gray-400" />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}