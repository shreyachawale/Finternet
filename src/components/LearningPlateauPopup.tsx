import { TrendingDown, AlertCircle, DollarSign } from 'lucide-react';

interface LearningPlateauPopupProps {
  onContinue: () => void;
  onEnd: () => void;
  currentCost: number;
  projectedWaste: number;
}

export default function LearningPlateauPopup({
  onContinue,
  onEnd,
  currentCost,
  projectedWaste,
}: LearningPlateauPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-yellow-500/50 rounded-3xl shadow-2xl max-w-md w-full p-8 animate-in">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <TrendingDown className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-3">
          Learning Plateau Detected
        </h2>

        <p className="text-gray-300 text-center mb-6">
          AI has detected diminishing returns. Consider ending now to save money while you've gained maximum value.
        </p>

        <div className="bg-gray-700/50 rounded-2xl p-5 mb-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Current Cost</span>
            <span className="text-white font-bold">${currentCost.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-400">Projected Waste</span>
            <span className="text-yellow-400 font-bold">+${projectedWaste.toFixed(2)}</span>
          </div>

          <div className="h-px bg-gray-600"></div>

          <div className="flex items-center justify-between">
            <span className="text-gray-300 font-semibold">If you continue 10 min</span>
            <span className="text-red-400 font-bold">${(currentCost + projectedWaste).toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-200">
            Ending now will boost your Learning Efficiency Score and save money.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onContinue}
            className="py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
          >
            Continue
          </button>
          <button
            onClick={onEnd}
            className="py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <DollarSign className="w-4 h-4" />
            <span>End & Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
