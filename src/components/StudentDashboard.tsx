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
  const [balance, setBalance] = useState<number | null>(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  // ---- FETCH WALLET ----
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch(
          "http://localhost:8000/wallets/student/id1"
        );

        if (!res.ok) throw new Error("Failed to fetch wallet");

        const data = await res.json();
        setBalance(data.balance);
      } catch (err) {
        console.error("Wallet fetch error:", err);
        setBalance(null);
      } finally {
        setLoadingBalance(false);
      }
    };

    fetchBalance();
  }, []);

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
              <h3 className="font-bold text-gray-800 mb-4">Wallet</h3>

              <p className="text-3xl font-bold text-gray-800 mb-2">
                {loadingBalance
                  ? "Loading..."
                  : balance !== null
                  ? `$${balance.toFixed(2)}`
                  : "--"}
              </p>

              <p className="text-sm text-gray-600 mb-4">
                Available balance
              </p>

              <button className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors text-sm">
                Add Funds
              </button>
            </div>
          </div>
        </div>
      </div>
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
