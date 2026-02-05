import { Zap, Clock, TrendingUp, Shield, Sparkles } from 'lucide-react';
import AIDiscovery from './AIDiscovery';

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

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 pt-20 pb-32">
        <div className="absolute top-20 right-[10%] w-[400px] h-[200px] bg-blue-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-[15%] w-[300px] h-[300px] bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-[30%] w-[250px] h-[150px] bg-blue-50/50 rounded-full blur-2xl" />

        <div className="relative z-10 text-center max-w-5xl">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-50/80 backdrop-blur-sm border border-blue-100/50 mb-12">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">AI-Powered Learning Marketplace</span>
          </div>

          <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif font-light text-gray-900 mb-8 leading-[0.95] tracking-tight">
            Pay only for<br />what you learn
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto mb-16 leading-relaxed">
            Every minute counts. Every lesson matters.<br />
            Start learning when you're ready, stop when you need.
          </p>

          <div className="flex gap-4 justify-center mb-20">
            <button 
              onClick={() => onNavigate('discovery')}
              className="px-8 py-4 bg-gray-900 text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10"
            >
              Start Learning
            </button>
          </div>
        </div>
      </section>

      <div className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <AIDiscovery/>
      </div>
    </div>
  );
}
