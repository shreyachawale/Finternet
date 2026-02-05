import { MessageCircle, Sparkles } from 'lucide-react';

export default function AIDiscovery() {
  const sessions = [
    { subject: 'Quantum Physics', teacher: 'Dr. Sarah Chen', rate: '$2.40/min', rating: '4.9' },
    { subject: 'Renaissance Art', teacher: 'Prof. Marco Rossi', rate: '$1.80/min', rating: '5.0' },
    { subject: 'Machine Learning', teacher: 'Alex Kumar', rate: '$3.20/min', rating: '4.8' },
  ];

  return (
    <section className="py-32 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-7xl font-serif font-light text-gray-900 mb-6">
            AI finds your<br />perfect teacher
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
            Tell us what you want to learn. Our AI matches you instantly.
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[60px] p-12 shadow-xl shadow-blue-100/20 backdrop-blur-sm border border-blue-100/50">
          <div className="bg-white/80 backdrop-blur-sm rounded-[40px] p-8 mb-8 border border-white/50 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-900 text-lg">
                  I want to understand how neural networks actually work, not just the theory
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-[40px] p-6 mb-8 border border-white/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-gray-700" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-lg font-light italic">
                  Finding 3 teachers who specialize in practical ML implementation...
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sessions.map((session, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-white/50 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-1">{session.subject}</h3>
                    <p className="text-gray-600">{session.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-light text-gray-900 mb-1">{session.rate}</p>
                    <p className="text-sm text-gray-600">★ {session.rating}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
