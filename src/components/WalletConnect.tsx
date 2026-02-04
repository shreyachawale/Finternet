import { useState } from 'react';
import { Wallet, Shield, Sparkles } from 'lucide-react';

interface WalletConnectProps {
  onNavigate: (screen: string) => void;
}

export default function WalletConnect({ onNavigate }: WalletConnectProps) {
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(47.82);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecharge = async () => {
    if (!amount || Number(amount) <= 0) {
      setError('Enter a valid amount');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const res = await fetch('http://localhost:8000/recharge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Number(amount),
        }),
      });

      if (!res.ok) throw new Error('Recharge failed');

      const data = await res.json();
      setBalance(data.new_balance);
      setAmount('');
    } catch (err) {
      setError('Unable to recharge wallet');
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-3xl font-bold text-gray-800 mb-3">
                  Connect Your Wallet
                </h1>
                <p className="text-gray-600">
                  Securely connect your wallet to continue
                </p>
              </div>

              <button
                onClick={() => setConnected(true)}
                className="w-full p-6 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-blue-500 rounded-2xl transition-all flex items-center space-x-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-800">MetaMask Wallet</h3>
                  <p className="text-sm text-gray-500">Connect Web3 wallet</p>
                </div>
              </button>
            </>
          ) : (
            <>
              {/* Wallet Info */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Wallet Connected
                </h1>
                <p className="text-gray-600">Recharge to start learning</p>
              </div>

              {/* Balance Card */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white mb-6">
                <p className="text-blue-100 text-sm mb-1">Available Balance</p>
                <h2 className="text-5xl font-bold">${balance.toFixed(2)}</h2>

                <div className="flex items-center space-x-2 text-sm text-blue-100 mt-4">
                  <Shield className="w-4 h-4" />
                  <span>0x7f...9a2e</span>
                </div>
              </div>

              {/* Recharge Section */}
              <div className="space-y-4 mb-6">
                <input
                  type="number"
                  placeholder="Enter amount ($)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                <button
                  onClick={handleRecharge}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-60"
                >
                  {loading ? 'Adding Balance...' : 'Add Balance'}
                </button>
              </div>

              <button
                onClick={() => onNavigate('discovery')}
                className="w-full py-3 border border-blue-500 text-blue-600 rounded-xl font-semibold hover:bg-blue-50"
              >
                Continue to Learning
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
