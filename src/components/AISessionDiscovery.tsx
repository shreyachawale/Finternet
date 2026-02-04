import { useState } from 'react';
import { Send, Star, Clock, DollarSign, Sparkles, Shield } from 'lucide-react';

interface AISessionDiscoveryProps {
  onNavigate: (screen: string, data?: any) => void;
}

const mockSessions = [
  {
    id: 1,
    teacher: 'Sarah Chen',
    subject: 'Piano - Jazz Improvisation',
    rate: 0.15,
    rating: 4.9,
    students: 328,
    avatar: 'SC',
    verified: true,
  },
  {
    id: 2,
    teacher: 'Marcus Johnson',
    subject: 'Spanish Conversation',
    rate: 0.12,
    rating: 4.8,
    students: 512,
    avatar: 'MJ',
    verified: true,
  },
  {
    id: 3,
    teacher: 'Elena Rodriguez',
    subject: 'Yoga & Mindfulness',
    rate: 0.10,
    rating: 4.9,
    students: 421,
    avatar: 'ER',
    verified: true,
  },
];

export default function AISessionDiscovery({ onNavigate }: AISessionDiscoveryProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ type: 'user' | 'ai'; text: string }>>([
    { type: 'ai', text: 'Hi! I\'m your AI learning assistant. What would you like to learn today?' }
  ]);
  const [showSessions, setShowSessions] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;

    setChatHistory([...chatHistory, { type: 'user', text: message }]);
    setMessage('');

    setTimeout(() => {
      setChatHistory(prev => [...prev, {
        type: 'ai',
        text: 'Perfect! I found some excellent teachers for you. Each session is billed per minute, and you get 90 seconds risk-free to preview.'
      }]);
      setShowSessions(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <nav className="px-8 py-6 backdrop-blur-sm bg-white/50 border-b border-white/60">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              LearnFlow
            </span>
          </button>

          <button
            onClick={() => onNavigate('studentDashboard')}
            className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Discover Your Perfect Session</h1>
          <p className="text-gray-600">AI-powered matching to find the best teachers for you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">AI Assistant</h2>
            </div>

            <div className="space-y-4 mb-6 h-96 overflow-y-auto">
              {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/80 text-gray-800 border border-gray-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-3">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="What do you want to learn?"
                className="flex-1 px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {showSessions && mockSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {session.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-800">{session.teacher}</h3>
                        {session.verified && (
                          <Shield className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{session.subject}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium">{session.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">{session.students} students</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-blue-600 font-bold text-lg">
                      <DollarSign className="w-5 h-5" />
                      <span>{session.rate}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>per minute</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('preBrief', session)}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                >
                  Start Risk-Free Preview
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
