import { Clock, DollarSign, TrendingUp, FileText, Star, CheckCircle, RefreshCcw } from 'lucide-react';

interface SessionSummaryProps {
  data: any;
  onNavigate: (screen: string, data?: any) => void;
}

export default function SessionSummary({ data, onNavigate }: SessionSummaryProps) {
  const timeInMinutes = (data?.timeUsed || 0) / 60;
  const refund = data?.timeUsed < 90 ? 0 : 0.50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Session Complete</h1>
          <p className="text-gray-600">Here's your learning summary</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 text-center">
            <Clock className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-800 mb-1">{timeInMinutes.toFixed(1)}</p>
            <p className="text-sm text-gray-600">Minutes Used</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 text-center">
            <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-800 mb-1">${(data?.cost || 0).toFixed(2)}</p>
            <p className="text-sm text-gray-600">Amount Charged</p>
          </div>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6 text-center">
            <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-gray-800 mb-1">{data?.valueScore || 0}%</p>
            <p className="text-sm text-gray-600">Value Score</p>
          </div>
        </div>

        {refund > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 mb-8 flex items-center space-x-4">
            <RefreshCcw className="w-8 h-8 text-green-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-green-800 mb-1">Smart Ending Bonus</h3>
              <p className="text-sm text-green-700">
                You ended at the optimal time! ${refund.toFixed(2)} refunded for efficient learning.
              </p>
            </div>
          </div>
        )}

        <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-800">AI Session Notes</h2>
          </div>

          <div className="space-y-3">
            {data?.aiNotes?.map((note: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-700">{note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
            <p className="text-sm text-gray-600 flex items-start space-x-2">
              <span className="text-purple-500 font-semibold">💡 Pro tip:</span>
              <span>These AI notes are automatically generated, so you can leave sessions earlier without taking notes.</span>
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <h3 className="text-xl font-bold mb-4">Session with {data?.teacher}</h3>
          <p className="text-blue-100 mb-6">{data?.subject}</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-blue-200 text-sm mb-1">Engagement</p>
              <p className="text-2xl font-bold">{data?.engagement || 0}%</p>
            </div>
            <div>
              <p className="text-blue-200 text-sm mb-1">Learning Efficiency</p>
              <p className="text-2xl font-bold">+15 pts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onNavigate('studentDashboard')}
            className="py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-xl border-2 border-gray-200 transition-all"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => onNavigate('review', data)}
            className="py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center space-x-2"
          >
            <Star className="w-5 h-5" />
            <span>Leave Review</span>
          </button>
        </div>
      </div>
    </div>
  );
}
