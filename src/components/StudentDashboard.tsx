import { Trophy, Shield, Clock, DollarSign, Star, TrendingUp, Sparkles, Gift, Zap } from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  const efficiencyScore = 847;
  const level = 'Platinum';
  const nextLevelAt = 1000;
  const progress = (efficiencyScore / nextLevelAt) * 100;

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
            onClick={() => onNavigate('discovery')}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Find Sessions
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome back, Alex!</h1>
          <p className="text-gray-600">Your learning journey at a glance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-blue-100 text-sm mb-2">Learning Efficiency Score</p>
                  <h2 className="text-6xl font-bold mb-2">{efficiencyScore}</h2>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-yellow-300" />
                    <span className="text-xl font-semibold text-yellow-300">{level} Learner</span>
                  </div>
                </div>

                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-yellow-300" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-100">Progress to Diamond</span>
                  <span className="text-white font-semibold">{nextLevelAt - efficiencyScore} points to go</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <TrendingUp className="w-5 h-5 text-green-300 mb-2" />
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs text-blue-100">Sessions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Clock className="w-5 h-5 text-blue-300 mb-2" />
                  <p className="text-2xl font-bold">8.2h</p>
                  <p className="text-xs text-blue-100">Total Time</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <Star className="w-5 h-5 text-yellow-300 mb-2" />
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-xs text-blue-100">Avg Rating</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Gift className="w-5 h-5 text-purple-500" />
                <span>Your Benefits</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-xl">
                  <Zap className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Extended Preview</p>
                    <p className="text-xs text-gray-600">120s risk-free (30s bonus)</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-xl">
                  <DollarSign className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Rate Discount</p>
                    <p className="text-xs text-gray-600">12% off per minute</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-xl">
                  <Shield className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Lower Lock</p>
                    <p className="text-xs text-gray-600">$2 vs $5 standard</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-xl">
                  <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Trusted Badge</p>
                    <p className="text-xs text-gray-600">Visible to teachers</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Wallet</h3>
              <p className="text-3xl font-bold text-gray-800 mb-2">$47.82</p>
              <p className="text-sm text-gray-600 mb-4">Available balance</p>
              <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors text-sm">
                Add Funds
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">How to Boost Your Score</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Stay Engaged</h3>
              <p className="text-sm text-gray-600">High participation = +20 pts</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Smart Endings</h3>
              <p className="text-sm text-gray-600">End at plateau = +15 pts</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Leave Reviews</h3>
              <p className="text-sm text-gray-600">Quality review = +10 pts</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
              <div className="w-12 h-12 bg-yellow-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Use AI Notes</h3>
              <p className="text-sm text-gray-600">Less note time = +8 pts</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Sessions</h2>

          <div className="space-y-4">
            {[
              { teacher: 'Sarah Chen', subject: 'Piano - Jazz', time: '15 min', cost: '$2.35', score: 94 },
              { teacher: 'Marcus Johnson', subject: 'Spanish', time: '22 min', cost: '$3.12', score: 89 },
              { teacher: 'Elena Rodriguez', subject: 'Yoga', time: '18 min', cost: '$1.98', score: 91 },
            ].map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {session.teacher.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{session.teacher}</p>
                    <p className="text-sm text-gray-600">{session.subject}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-800">{session.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Cost</p>
                    <p className="font-semibold text-gray-800">{session.cost}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="font-semibold text-green-600">{session.score}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
