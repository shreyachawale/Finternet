import { useState, useEffect } from 'react';
import { Clock, DollarSign, TrendingUp, Activity, Video, Sparkles, X, Users, FileText } from 'lucide-react';
import LearningPlateauPopup from './LearningPlateauPopup';

interface LiveSessionProps {
  session: any;
  onNavigate: (screen: string, data?: any) => void;
}

export default function LiveSession({ session, onNavigate }: LiveSessionProps) {
  const [seconds, setSeconds] = useState(0);
  const [cost, setCost] = useState(0);
  const [valueScore, setValueScore] = useState(85);
  const [engagement, setEngagement] = useState(92);
  const [showPlateauPopup, setShowPlateauPopup] = useState(false);
  const [aiNotes, setAiNotes] = useState<string[]>([
    'Started with chord theory fundamentals',
    'Practicing ii-V-I progression in C major',
  ]);

  const isRiskFree = seconds < 90;
  const rate = session?.rate || 0.15;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => s + 1);
      if (seconds > 90) {
        setCost(((seconds - 90) / 60) * rate);
      }

      if (seconds === 300) {
        setValueScore(72);
        setEngagement(68);
        setShowPlateauPopup(true);
      }

      if (seconds % 30 === 0 && seconds > 0) {
        const notes = [
          'Demonstrated correct finger positioning for jazz voicings',
          'Explored melodic improvisation over changes',
          'Practiced voice leading between chords',
          'Applied swing feel to rhythmic patterns'
        ];
        if (aiNotes.length < 4) {
          setAiNotes(prev => [...prev, notes[aiNotes.length]]);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, rate, aiNotes.length]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    onNavigate('summary', {
      timeUsed: seconds,
      cost,
      valueScore,
      engagement,
      aiNotes,
      teacher: session.teacher,
      subject: session.subject,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {isRiskFree && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 text-center font-medium animate-pulse">
          Risk-Free Preview: {90 - seconds}s remaining - No charges yet
        </div>
      )}

      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                {session?.avatar}
              </div>
              <div>
                <p className="font-semibold text-white">{session?.teacher}</p>
                <p className="text-sm text-gray-400">{session?.subject}</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xl font-bold text-white tabular-nums">{formatTime(seconds)}</span>
                </div>
              </div>

              <div className="bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-xl font-bold text-white tabular-nums">${cost.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-gray-400">Value</span>
                  <span className={`text-xl font-bold tabular-nums ${
                    valueScore > 80 ? 'text-green-400' : valueScore > 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {valueScore}%
                  </span>
                </div>
              </div>

              <div className="bg-gray-700/50 backdrop-blur-sm px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-400">Engagement</span>
                  <span className={`text-xl font-bold tabular-nums ${
                    engagement > 80 ? 'text-green-400' : engagement > 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {engagement}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleEndSession}
            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
          >
            End Session
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 overflow-hidden aspect-video flex items-center justify-center relative">
            <Video className="w-20 h-20 text-gray-600" />
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold flex items-center space-x-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              <span>LIVE</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1 animate-pulse" />
              <div>
                <h3 className="font-semibold text-white mb-2">AI Whisper</h3>
                <p className="text-purple-100">
                  Great progress on chord voicings! Try asking about tritone substitutions next - it's a natural progression from what you're learning.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Value Meter</span>
                <TrendingUp className="w-4 h-4 text-purple-400" />
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    valueScore > 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                    valueScore > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${valueScore}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Learning effectiveness in real-time</p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-400">Engagement</span>
                <Activity className="w-4 h-4 text-blue-400" />
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    engagement > 80 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                    engagement > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${engagement}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Active participation tracking</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>Quick Actions</span>
            </h3>

            <div className="space-y-3">
              <button className="w-full py-3 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl transition-colors text-sm font-medium">
                Switch Teacher
              </button>
              <button
                onClick={handleEndSession}
                className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-colors text-sm font-medium border border-red-500/30"
              >
                End & Save Money
              </button>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700 p-6">
            <h3 className="font-semibold text-white mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-green-400" />
              <span>Live AI Notes</span>
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {aiNotes.map((note, idx) => (
                <div key={idx} className="bg-gray-700/30 rounded-lg p-3 text-sm text-gray-300 border-l-2 border-green-400">
                  {note}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 mt-3">
              AI is automatically capturing key learning points
            </p>
          </div>
        </div>
      </div>

      {showPlateauPopup && (
        <LearningPlateauPopup
          onContinue={() => setShowPlateauPopup(false)}
          onEnd={handleEndSession}
          currentCost={cost}
          projectedWaste={2.25}
        />
      )}
    </div>
  );
}
