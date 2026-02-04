import { useEffect, useState } from "react";
import {
  Trophy,
  Shield,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Sparkles,
  Gift,
  Zap,
  Plus,
  Minus,
  ShoppingCart,
  X,
} from "lucide-react";

interface StudentDashboardProps {
  onNavigate: (screen: string) => void;
}

export default function StudentDashboard({ onNavigate }: StudentDashboardProps) {
  // ---- GAMIFICATION ----
  const efficiencyScore = 847;
  const level = "Platinum";
  const nextLevelAt = 1000;
  const progress = (efficiencyScore / nextLevelAt) * 100;

  // ---- WALLET STATE ----
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"deposit" | "withdraw" | "spend" | null>(null);
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [processing, setProcessing] = useState(false);

  // ---- FETCH WALLET ----
  const fetchWalletData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/wallet-sync");
      if (!res.ok) throw new Error("Failed to fetch wallet");
      const data = await res.json();
      setBalance(data.balance || 0);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error("Wallet fetch error:", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    // Poll every 3 seconds for updates
    const interval = setInterval(fetchWalletData, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---- WALLET ACTIONS ----
  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    setProcessing(true);
    try {
      const res = await fetch("http://localhost:8000/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (data.paymentUrl) {
        window.open(data.paymentUrl, "_blank");
        setModalOpen(false);
        setAmount("");
        setTimeout(fetchWalletData, 2000);
      }
    } catch (err) {
      console.error("Deposit error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) return;
    setProcessing(true);
    try {
      const res = await fetch("http://localhost:8000/api/wallet/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Number(amount),
          bankAccount: bankAccount || "Default Bank"
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setAmount("");
        setBankAccount("");
        fetchWalletData();
      }
    } catch (err) {
      console.error("Withdraw error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleSpend = async () => {
    if (!amount || Number(amount) <= 0) return;
    setProcessing(true);
    try {
      const res = await fetch("http://localhost:8000/api/wallet/spend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setAmount("");
        fetchWalletData();
      }
    } catch (err) {
      console.error("Spend error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const openModal = (action: "deposit" | "withdraw" | "spend") => {
    setModalAction(action);
    setModalOpen(true);
    setAmount("");
    setBankAccount("");
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalAction(null);
    setAmount("");
    setBankAccount("");
  };

  const handleSubmit = () => {
    if (modalAction === "deposit") handleDeposit();
    else if (modalAction === "withdraw") handleWithdraw();
    else if (modalAction === "spend") handleSpend();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* NAVBAR */}
      <nav className="px-8 py-6 backdrop-blur-sm bg-white/50 border-b border-white/60">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => onNavigate("landing")}
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
            onClick={() => onNavigate("discovery")}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Find Sessions
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, Alex!
          </h1>
          <p className="text-gray-600">Your learning journey at a glance</p>
        </div>

        {/* TOP GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* SCORE CARD */}
          <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-blue-100 text-sm mb-2">
                    Learning Efficiency Score
                  </p>
                  <h2 className="text-6xl font-bold mb-2">
                    {efficiencyScore}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-yellow-300" />
                    <span className="text-xl font-semibold text-yellow-300">
                      {level} Learner
                    </span>
                  </div>
                </div>

                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-yellow-300" />
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-blue-100">Progress to Diamond</span>
                  <span className="text-white font-semibold">
                    {nextLevelAt - efficiencyScore} points to go
                  </span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-300 to-yellow-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <StatCard icon={<TrendingUp />} value="15" label="Sessions" />
                <StatCard icon={<Clock />} value="8.2h" label="Total Time" />
                <StatCard icon={<Star />} value="4.9" label="Avg Rating" />
              </div>
            </div>
          </div>

          {/* SIDE COLUMN */}
          <div className="space-y-6">
            {/* BENEFITS */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Gift className="w-5 h-5 text-purple-500" />
                <span>Your Benefits</span>
              </h3>

              <Benefit
                icon={<Zap className="text-green-500" />}
                title="Extended Preview"
                desc="120s risk-free (30s bonus)"
                bg="bg-green-50"
              />
              <Benefit
                icon={<DollarSign className="text-blue-500" />}
                title="Rate Discount"
                desc="12% off per minute"
                bg="bg-blue-50"
              />
              <Benefit
                icon={<Shield className="text-purple-500" />}
                title="Lower Lock"
                desc="$2 vs $5 standard"
                bg="bg-purple-50"
              />
              <Benefit
                icon={<Trophy className="text-yellow-500" />}
                title="Trusted Badge"
                desc="Visible to teachers"
                bg="bg-yellow-50"
              />
            </div>

            {/* WALLET */}
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-white/60 shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-blue-500" />
                <span>Wallet</span>
              </h3>

              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-4 text-white">
                <p className="text-xs text-blue-100 mb-1">Total Balance</p>
                <p className="text-3xl font-bold">
                  {loadingBalance ? "Loading..." : `$${balance.toFixed(2)}`}
                </p>
                <p className="text-xs text-blue-100 mt-1">USDC</p>
              </div>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => openModal("deposit")}
                  className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <button
                  onClick={() => openModal("withdraw")}
                  className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <Minus className="w-4 h-4" />
                  Withdraw
                </button>
                <button
                  onClick={() => openModal("spend")}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Spend
                </button>
              </div>

              {/* Transaction History */}
              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-600 mb-2">Recent Transactions</p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex justify-between items-start text-xs p-2 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{tx.type}</p>
                        <p className="text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                        {tx.details && <p className="text-gray-400 italic">{tx.details}</p>}
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === "DEPOSIT" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "DEPOSIT" ? "+" : "-"}${tx.amount.toFixed(2)}
                        </p>
                        {tx.status === "PENDING" && (
                          <p className="text-blue-500 text-xs animate-pulse">Verifying...</p>
                        )}
                        {tx.status === "COMPLETED" && (
                          <p className="text-green-500 text-xs">✓ Done</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-2">No transactions yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WALLET MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                {modalAction === "deposit" && "Add Money (USDC)"}
                {modalAction === "withdraw" && "Withdraw to Bank"}
                {modalAction === "spend" && "Spend Money"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalAction === "withdraw" && (
              <input
                type="text"
                placeholder="Bank Account Number"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full px-4 py-3 mb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            )}

            <input
              type="number"
              placeholder="Amount (0.00)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={processing || !amount || Number(amount) <= 0}
                className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all ${
                  modalAction === "deposit"
                    ? "bg-green-500 hover:bg-green-600"
                    : modalAction === "withdraw"
                    ? "bg-purple-500 hover:bg-purple-600"
                    : "bg-red-500 hover:bg-red-600"
                } disabled:opacity-50`}
              >
                {processing
                  ? "Processing..."
                  : modalAction === "deposit"
                  ? "Proceed to Payment"
                  : modalAction === "withdraw"
                  ? "Withdraw Now"
                  : "Pay Merchant"}
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function StatCard({
  icon,
  value,
  label,
}: {
  icon: JSX.Element;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
      <div className="w-5 h-5 text-white mb-2">{icon}</div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-blue-100">{label}</p>
    </div>
  );
}

function Benefit({
  icon,
  title,
  desc,
  bg,
}: {
  icon: JSX.Element;
  title: string;
  desc: string;
  bg: string;
}) {
  return (
    <div className={`flex items-start space-x-3 p-3 rounded-xl ${bg}`}>
      <div className="w-5 h-5 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-600">{desc}</p>
      </div>
    </div>
  );
}
