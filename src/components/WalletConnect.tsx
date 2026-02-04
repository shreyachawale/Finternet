import { useState } from 'react';
import { Wallet, CreditCard, Shield, Sparkles, ArrowRight } from 'lucide-react';

interface WalletConnectProps {
  onNavigate: (screen: string) => void;
}

export default function WalletConnect({ onNavigate }: WalletConnectProps) {
  const [connected, setConnected] = useState(false);
  const [balance] = useState(47.82);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        <button
          onClick={() => onNavigate('landing')}
          className="mb-8 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back
        </button>

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-10">
          {!connected ? (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Connect Your Wallet</h1>
                <p className="text-gray-600">Choose your preferred payment method to get started</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setConnected(true)}
                  className="w-full p-6 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-500 rounded-2xl transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">MetaMask Wallet</h3>
                      <p className="text-sm text-gray-500">Connect with Web3 wallet</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>

                <button
                  onClick={() => setConnected(true)}
                  className="w-full p-6 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-500 rounded-2xl transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">Credit/Debit Card</h3>
                      <p className="text-sm text-gray-500">Traditional payment method</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-xl flex items-start space-x-3">
                <Shield className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Your payment information is encrypted and secure. We only charge for the exact time used in sessions.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-pulse">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-3">Wallet Connected</h1>
                <p className="text-gray-600">You're all set to start learning</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Available Balance</p>
                    <h2 className="text-5xl font-bold">${balance.toFixed(2)}</h2>
                  </div>
                  <Sparkles className="w-8 h-8 text-blue-200" />
                </div>

                <div className="flex items-center space-x-2 text-sm text-blue-100">
                  <Shield className="w-4 h-4" />
                  <span>0x7f...9a2e</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Locked Funds</p>
                  <p className="text-2xl font-bold text-gray-800">$5.00</p>
                </div>
                <div className="bg-white/50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-800">$128.40</p>
                </div>
              </div>

              <button
                onClick={() => onNavigate('discovery')}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
              >
                Start Learning
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
