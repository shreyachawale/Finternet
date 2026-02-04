import { Zap, Clock, TrendingUp, Shield, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (screen: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,197,253,0.15),transparent_50%)]"></div>

      <nav className="relative z-10 px-8 py-6 flex justify-between items-center backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            LearnFlow
          </span>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => onNavigate('teacherDashboard')}
            className="px-6 py-2.5 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            For Teachers
          </button>
          <button
            onClick={() => onNavigate('wallet')}
            className="px-6 py-2.5 bg-white text-blue-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            Connect Wallet
          </button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent leading-tight">
            Pay Only for What You Learn
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join live learning sessions and pay per minute. AI ensures every second counts.
          </p>

          <button
            onClick={() => onNavigate('discovery')}
            className="px-10 py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 inline-flex items-center space-x-2"
          >
            <span>Start Learning Now</span>
            <Zap className="w-5 h-5" />
          </button>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">00:15:42</div>
                <div className="text-sm text-gray-600 font-medium">Time Used</div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-green-600 mb-2">$2.35</div>
                <div className="text-sm text-gray-600 font-medium">Cost</div>
              </div>

              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-purple-600 mb-2">94%</div>
                <div className="text-sm text-gray-600 font-medium">Value Score</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/60">
            <Shield className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">90s Risk-Free</h3>
            <p className="text-sm text-gray-600">Preview before you pay</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/60">
            <Sparkles className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">AI Assistant</h3>
            <p className="text-sm text-gray-600">Smart learning guidance</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/60">
            <TrendingUp className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Value Tracking</h3>
            <p className="text-sm text-gray-600">Real-time effectiveness</p>
          </div>

          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/60">
            <Zap className="w-10 h-10 text-blue-500 mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Zero Overhead</h3>
            <p className="text-sm text-gray-600">Pure learning time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
