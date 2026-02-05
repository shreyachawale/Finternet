import { useState, useEffect, useMemo } from 'react';
import { Send, Star, Clock, DollarSign, Sparkles, Shield, Filter, X } from 'lucide-react';
import { semanticSearch } from '../utils/semanticMatch';
import courses from '../data/courses.json';

interface AISessionDiscoveryProps {
  onNavigate: (screen: string, data?: any) => void;
}

type ChatMsg = { type: 'user' | 'ai'; text: string };

export default function AISessionDiscovery({ onNavigate }: AISessionDiscoveryProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([
    {
      type: 'ai',
      text: 'Tell me what you want to learn, or pick a topic to get started.'
    }
  ]);
  const [sessions, setSessions] = useState<typeof courses>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Extract all unique tags
  const allTopics = useMemo(() => {
    const tags = new Set<string>();
    courses.forEach(c => c.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, []);

  // Initial random recommendation
  useEffect(() => {
    // Shuffle and pick 4 random courses initially
    const shuffled = [...courses].sort(() => 0.5 - Math.random());
    setSessions(shuffled.slice(0, 4));
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;

    setChatHistory(prev => [...prev, { type: 'user', text: message }]);
    const query = message;
    setMessage('');
    setSelectedTopic(null); // Clear filter when searching

    setTimeout(() => {
      const results = semanticSearch(query);
      
      setChatHistory(prev => [
        ...prev,
        {
          type: 'ai',
          text:
            results.length > 0
              ? `I found ${results.length} sessions matching "${query}".`
              : `I couldn't find exact matches for "${query}", but here are some popular sessions.`
        }
      ]);
      
      if (results.length > 0) {
        setSessions(results);
      } else {
         // Fallback to random if search yields nothing
         const shuffled = [...courses].sort(() => 0.5 - Math.random());
         setSessions(shuffled.slice(0, 4));
      }
    }, 600);
  };

  const handleTopicSelect = (topic: string) => {
    if (selectedTopic === topic) {
        // Toggle off
        setSelectedTopic(null);
        // Go back to random
        const shuffled = [...courses].sort(() => 0.5 - Math.random());
        setSessions(shuffled.slice(0, 4));
        return;
    }

    setSelectedTopic(topic);
    const filtered = courses.filter(c => c.tags.includes(topic));
    setSessions(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* NAV */}
      <nav className="px-8 py-6 backdrop-blur-sm bg-white/50 border-b border-white/60">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-blue-700">Murph</span>
          </div>

          <button
            onClick={() => onNavigate('studentDashboard')}
            className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-medium shadow"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
           <h1 className="text-4xl font-bold text-gray-800 mb-2">
             Discover Recorded Sessions
           </h1>
           <p className="text-gray-600">
             Pay per minute watched • Stop anytime • Escrow protected
           </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: CHAT & FILTERS */}
          <div className="lg:col-span-5 space-y-6">
             {/* AI CHAT */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border shadow-xl p-6 h-[500px] flex flex-col">
                <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-bold">AI Guide</h2>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {chatHistory.map((msg, idx) => (
                    <div
                    key={idx}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                    <div
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm ${
                        msg.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                    >
                        {msg.text}
                    </div>
                    </div>
                ))}
                </div>

                <div className="flex space-x-2">
                <input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Ask specifically..."
                    className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                />
                <button
                    onClick={handleSend}
                    className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                    <Send className="w-5 h-5" />
                </button>
                </div>
            </div>
            
            {/* TOPIC FILTERS */}
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl border shadow-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                    <Filter className="w-5 h-5 text-blue-500" />
                    <h3 className="font-bold text-gray-800">Filter by Topic</h3>
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {allTopics.map(topic => (
                        <button
                            key={topic}
                            onClick={() => handleTopicSelect(topic)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                selectedTopic === topic
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-blue-50'
                            }`}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SESSIONS GRID */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                    {selectedTopic ? `Topic: ${selectedTopic}` : 'Recommended For You'}
                </h2>
                {selectedTopic && (
                    <button 
                        onClick={() => handleTopicSelect(selectedTopic)}
                        className="text-sm text-red-500 hover:text-red-600 flex items-center space-x-1"
                    >
                        <X className="w-4 h-4" />
                        <span>Clear Filter</span>
                    </button>
                )}
            </div>

            <div className="space-y-4">
                {sessions.map(session => (
                <div
                    key={session.id}
                    className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                    <div className="flex justify-between mb-4">
                    <div className="flex space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white flex items-center justify-center font-bold text-lg shadow-inner">
                        {session.avatar}
                        </div>
                        <div>
                        <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-gray-900 text-lg">{session.teacher}</h3>
                            {session.verified && (
                            <Shield className="w-4 h-4 text-blue-500" />
                            )}
                        </div>
                        <p className="text-sm text-gray-600 font-medium">{session.subject}</p>
                        <div className="flex items-center space-x-3 text-sm mt-1">
                            <div className="flex items-center space-x-1 bg-yellow-100 px-2 py-0.5 rounded-md">
                                <Star className="w-3.5 h-3.5 text-yellow-600 fill-yellow-600" />
                                <span className="font-bold text-yellow-700">{session.rating}</span>
                            </div>
                            <span className="text-gray-500">
                            {session.students} students
                            </span>
                        </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="flex items-center justify-end text-blue-600 font-bold text-xl">
                        <DollarSign className="w-5 h-5" />
                        {session.rate}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center justify-end font-medium">
                        <Clock className="w-3 h-3 mr-1" /> per minute
                        </div>
                    </div>
                    </div>

                    {/* DETAILED INFO */}
                    <div className="bg-blue-50/50 rounded-xl p-4 text-sm text-blue-900 mb-4 space-y-3 border border-blue-100">
                    {session.why_this_fits && (
                        <div className="flex items-start space-x-2">
                        <span className="text-lg">💡</span>
                        <span className="leading-relaxed"><strong>Why this fits:</strong> {session.why_this_fits}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 text-xs font-medium text-blue-800/80 pt-2 border-t border-blue-100/50">
                        <div className="flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span>Recorded • Resume anytime</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span>Best value: {session.recommended_min}–{session.recommended_max} min</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span>Max charge: ~${session.max_charge?.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                            <span>Escrow protected</span>
                        </div>
                    </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex flex-wrap gap-2">
                            {session.tags.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <button
                        onClick={() => onNavigate('preBrief', session)}
                        className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all"
                        >
                        Start Session
                        </button>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
