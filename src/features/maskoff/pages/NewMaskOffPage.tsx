import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Check, Trash2 } from 'lucide-react';
import { moodEmojis, type Mood } from '../../../types/journal';

const moods: Mood[] = ['happy', 'calm', 'grateful', 'anxious', 'sad', 'angry', 'confused', 'hopeful', 'tired', 'neutral'];

const defaultTheme = { name: 'Midnight', color: 'bg-slate-900', text: 'text-white', border: 'border-slate-700', emoji: '🌙' };

export function NewMaskOffPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = location.state?.theme || defaultTheme;
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  let durationInterval: NodeJS.Timeout;

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      
      let duration = 0;
      durationInterval = setInterval(() => {
        duration++;
        setRecordingDuration(duration);
      }, 1000);
    } catch (error) {
      alert('Please allow microphone access');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      clearInterval(durationInterval);
    }
  };

  const deleteRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL(null);
      setRecordingDuration(0);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = () => {
    console.log('Mask-Off Entry:', { title, content, mood: selectedMood, audioURL });
    navigate('/maskoff', { state: { fromEntry: true } });
  };

  return (
    <div className={`min-h-screen ${theme.color} ${theme.text}`}>
      <div className={`${theme.color}/80 backdrop-blur-md border-b ${theme.border} sticky top-0 z-10`}>
        <div className="px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/maskoff', { state: { fromEntry: true } })} 
            className="p-2 hover:bg-white/10 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-serif text-xl font-semibold">
            New Mask-Off Entry
          </h2>
          <button 
            onClick={handleSave} 
            className="px-5 py-2 bg-white/20 rounded-full text-sm font-medium hover:bg-white/30 transition"
          >
            Save
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8 max-w-2xl mx-auto">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-serif bg-transparent border-b-2 border-white/30 py-2 focus:outline-none focus:border-white/60 placeholder:text-white/40"
        />

        <div>
          <button
            onClick={() => setShowMoodPicker(!showMoodPicker)}
            className="w-full p-3 bg-white/10 rounded-xl border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedMood ? moodEmojis[selectedMood] : '😊'}</span>
                <span className="text-sm text-white/70">
                  {selectedMood ? `Feeling ${selectedMood}` : 'How are you feeling?'}
                </span>
              </div>
              <span className="text-white/40 text-xs">{showMoodPicker ? '▲' : '▼'}</span>
            </div>
          </button>

          {showMoodPicker && (
            <div className="mt-2 p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 grid grid-cols-5 gap-1">
              {moods.map((mood) => (
                <button
                  key={mood}
                  onClick={() => { setSelectedMood(mood); setShowMoodPicker(false); }}
                  className="p-2 rounded-lg text-center hover:bg-white/20 transition"
                >
                  <div className="text-xl">{moodEmojis[mood]}</div>
                  <div className="text-xs capitalize">{mood}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          placeholder="Write your thoughts here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full p-4 bg-white/10 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none placeholder:text-white/40"
        />

        <div className="flex flex-col items-center justify-center py-12">
          {!audioURL ? (
            <div className="text-center">
              <button onClick={isRecording ? stopRecording : startRecording} className="relative group">
                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-red-200/50 animate-ping" />
                    <div className="absolute inset-0 rounded-full bg-red-100/30 animate-pulse" />
                  </>
                )}
                <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  isRecording ? 'bg-gradient-to-br from-rose-500 to-red-500' : 'bg-white/20'
                }`}>
                  {isRecording ? <Square className="w-10 h-10 text-white fill-white" /> : <Mic className="w-14 h-14" />}
                </div>
              </button>

              <div className="mt-6 text-center">
                {isRecording ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-red-400">Recording</span>
                    </div>
                    <p className="text-2xl font-mono font-light">{formatDuration(recordingDuration)}</p>
                    <p className="text-xs text-white/40">Tap square to stop</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white/70">Tap to record</p>
                    <p className="text-xs text-white/40">Speak your thoughts freely</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center w-full max-w-md">
              <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <p className="text-sm font-medium mb-2">Voice note captured</p>
                <audio src={audioURL} controls className="w-full mt-3 rounded-lg" />
                <button onClick={deleteRecording} className="mt-4 px-4 py-2 text-red-400 text-sm hover:bg-white/10 rounded-full transition-colors inline-flex items-center gap-1">
                  <Trash2 className="w-3 h-3" />
                  Delete & re-record
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-center py-4">
          <p className="text-xs text-white/40 italic">"Your private thoughts are safe here. No one judges."</p>
        </div>
      </div>
    </div>
  );
}