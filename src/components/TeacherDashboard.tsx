import { DollarSign, TrendingUp, Users, Star, Award, Sparkles, Shield, Target, Clock, Zap } from 'lucide-react';

interface TeacherDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function TeacherDashboard({ onNavigate }: TeacherDashboardProps) {
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

          <div className="flex space-x-4">
            <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
              Go Live
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Teacher Dashboard</h1>
          <p className="text-gray-600">Track your earnings and teaching performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <DollarSign className="w-8 h-8 text-green-500" />
              <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +12.5%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">$2,847.50</p>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <Users className="w-8 h-8 text-blue-500" />
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                +8
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">328</p>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                4.9
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">4.9</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <Award className="w-8 h-8 text-purple-500" />
              <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                TOP 5%
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-800 mb-1">$428.20</p>
            <p className="text-sm text-gray-600">Quality Bonus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Engagement Analytics</h2>

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-800 mb-1">94%</p>
                <p className="text-sm text-gray-600">Avg Value Score</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-800 mb-1">22.5</p>
                <p className="text-sm text-gray-600">Avg Minutes</p>
              </div>

              <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <Zap className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-800 mb-1">91%</p>
                <p className="text-sm text-gray-600">Engagement</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Student Satisfaction</span>
                  <span className="font-semibold text-gray-800">96%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600 w-[96%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Session Completion</span>
                  <span className="font-semibold text-gray-800">88%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 w-[88%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Repeat Students</span>
                  <span className="font-semibold text-gray-800">73%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 w-[73%]"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-10 h-10 text-purple-200" />
                <Award className="w-10 h-10 text-yellow-300" />
              </div>
              <h3 className="text-xl font-bold mb-2">Reputation Passport</h3>
              <p className="text-purple-100 text-sm mb-4">
                Blockchain-verified teaching credential
              </p>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-purple-100">Trust Score</span>
                  <span className="text-2xl font-bold">98/100</span>
                </div>
                <div className="text-xs text-purple-200">
                  Top 2% of all teachers
                </div>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Quality Bonuses</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <span className="text-sm text-gray-700">High Value Score</span>
                  <span className="font-bold text-green-600">+15%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm text-gray-700">Student Retention</span>
                  <span className="font-bold text-blue-600">+10%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <span className="text-sm text-gray-700">5-Star Reviews</span>
                  <span className="font-bold text-purple-600">+8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <span>AI Teaching Coach Tips</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <Target className="w-8 h-8 text-blue-500 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Optimize Pacing</h3>
              <p className="text-sm text-gray-600 mb-3">
                Students show peak engagement in minutes 8-15. Structure key concepts here.
              </p>
              <span className="text-xs font-semibold text-blue-600">Potential +$120/week</span>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <TrendingUp className="w-8 h-8 text-green-500 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Boost Retention</h3>
              <p className="text-sm text-gray-600 mb-3">
                End sessions with clear next steps. 65% more likely to rebook.
              </p>
              <span className="text-xs font-semibold text-green-600">High impact</span>
            </div>

            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <Award className="w-8 h-8 text-purple-500 mb-3" />
              <h3 className="font-bold text-gray-800 mb-2">Earn More Bonus</h3>
              <p className="text-sm text-gray-600 mb-3">
                Increase value score by 2% to unlock next quality bonus tier.
              </p>
              <span className="text-xs font-semibold text-purple-600">+$85/week possible</span>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Sessions</h2>

          <div className="space-y-4">
            {[
              { student: 'Alex M.', subject: 'Piano - Jazz', time: '15 min', earned: '$2.35', score: 94, badge: true },
              { student: 'Jamie L.', subject: 'Piano - Jazz', time: '22 min', earned: '$3.45', score: 89, badge: false },
              { student: 'Sam K.', subject: 'Piano - Jazz', time: '18 min', earned: '$2.82', score: 91, badge: true },
            ].map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                    {session.student.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold text-gray-800">{session.student}</p>
                      {session.badge && (
                        <Shield className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{session.subject}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-800">{session.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Earned</p>
                    <p className="font-semibold text-green-600">{session.earned}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Value</p>
                    <p className="font-semibold text-gray-800">{session.score}%</p>
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
