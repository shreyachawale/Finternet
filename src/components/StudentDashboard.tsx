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
  BookOpen,
  CheckCircle,
  PlayCircle,
  ArrowRight,
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

  // ---- USER ID ----
  const STUDENT_ID = "student_1"; // TODO: Get from auth context

  // ---- WALLET STATE ----
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"deposit" | "withdraw" | "spend" | null>(null);
  const [amount, setAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [processing, setProcessing] = useState(false);

  // ---- LEARNING ROADMAP STATE ----
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);

  // ---- FETCH WALLET ----
  const fetchWalletData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/wallet-sync/${STUDENT_ID}`);
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

  // ---- FETCH COURSES AND MATCH WITH TRANSACTIONS ----
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await fetch('/src/data/courses.json');
        const coursesData = await response.json();
        setCourses(coursesData);

        // Match courses with transaction history
        const spendTransactions = transactions.filter(tx => tx.type === "SPEND" && tx.details?.includes("Session payment"));
        
        const enrolled = coursesData
          .filter((course: any) => {
            // Check if user has paid for this course by matching teacher names
            const teacherId = course.teacher.toLowerCase().replace(/\s+/g, "_");
            return spendTransactions.some(tx => tx.details?.includes(teacherId));
          })
          .map((course: any) => {
            // Find all transactions for this course
            const teacherId = course.teacher.toLowerCase().replace(/\s+/g, "_");
            const courseTxs = spendTransactions.filter(tx => tx.details?.includes(teacherId));
            const totalSpent = courseTxs.reduce((sum, tx) => sum + tx.amount, 0);
            const lastWatched = courseTxs.length > 0 ? courseTxs[0].date : null;
            
            // Calculate estimated progress (rough estimate based on spending)
            const estimatedProgress = Math.min(100, Math.round((totalSpent / course.max_charge) * 100));
            
            return {
              ...course,
              totalSpent,
              lastWatched,
              transactionCount: courseTxs.length,
              progress: estimatedProgress,
              status: estimatedProgress >= 80 ? 'completed' : estimatedProgress > 0 ? 'in-progress' : 'started'
            };
          })
          .sort((a, b) => new Date(b.lastWatched).getTime() - new Date(a.lastWatched).getTime());

        setEnrolledCourses(enrolled);
      } catch (error) {
        console.error("Failed to load courses:", error);
      }
    };

    if (transactions.length > 0) {
      loadCourses();
    }
  }, [transactions]);

  // ---- WALLET ACTIONS ----
  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) return;
    setProcessing(true);
    try {
      const res = await fetch("http://localhost:8000/api/wallet/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: Number(amount),
          user_id: STUDENT_ID
        }),
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
          bankAccount: bankAccount || "Default Bank",
          user_id: STUDENT_ID
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
        body: JSON.stringify({ 
          amount: Number(amount),
          user_id: STUDENT_ID
        }),
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
          {/* WALLET CARD */}
          <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-blue-500" />
                Your Wallet
              </h2>
              <p className="text-gray-600">Manage your balance and transactions</p>
            </div>

            {/* Balance Display */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
              
              <div className="relative z-10">
                <p className="text-blue-100 text-sm mb-2">Total Balance</p>
                <p className="text-5xl font-bold mb-2">
                  {loadingBalance ? "Loading..." : `$${balance.toFixed(2)}`}
                </p>
                <p className="text-blue-100 text-sm">USDC</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => openModal("deposit")}
                  className="py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium text-sm transition-all flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Plus className="w-6 h-6" />
                  Add Funds
                </button>
                <button
                  onClick={() => openModal("withdraw")}
                  className="py-4 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-medium text-sm transition-all flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Minus className="w-6 h-6" />
                  Withdraw
                </button>
                <button
                  onClick={() => openModal("spend")}
                  className="py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium text-sm transition-all flex flex-col items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Spend
                </button>
              </div>
            </div>

            {/* Transaction History */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Recent Transactions
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {transactions.slice(0, 6).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-start p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "DEPOSIT" || tx.type === "EARN" 
                          ? "bg-green-100" 
                          : "bg-red-100"
                      }`}>
                        {tx.type === "DEPOSIT" || tx.type === "EARN" ? (
                          <Plus className="w-5 h-5 text-green-600" />
                        ) : (
                          <Minus className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{tx.type}</p>
                        <p className="text-xs text-gray-500">{new Date(tx.date).toLocaleDateString()}</p>
                        {tx.details && <p className="text-xs text-gray-400 italic mt-1">{tx.details}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${tx.type === "DEPOSIT" || tx.type === "EARN" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "DEPOSIT" || tx.type === "EARN" ? "+" : "-"}${tx.amount.toFixed(2)}
                      </p>
                      {tx.status === "PENDING" && (
                        <p className="text-blue-500 text-xs animate-pulse mt-1">Verifying...</p>
                      )}
                      {tx.status === "COMPLETED" && (
                        <p className="text-green-500 text-xs mt-1">✓ Done</p>
                      )}
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-400">No transactions yet</p>
                    <p className="text-sm text-gray-400">Start by adding funds to your wallet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDE COLUMN */}
          <div className="space-y-6">
            {/* STATS CARD */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-blue-100 text-xs mb-1">Learning Score</p>
                  <h3 className="text-4xl font-bold">{efficiencyScore}</h3>
                </div>
                <Trophy className="w-12 h-12 text-yellow-300" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-yellow-300" />
                <span className="text-sm font-semibold text-yellow-300">{level} Learner</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Sessions</span>
                  </div>
                  <span className="font-bold">15</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Total Time</span>
                  </div>
                  <span className="font-bold">8.2h</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>Avg Rating</span>
                  </div>
                  <span className="font-bold">4.9</span>
                </div>
              </div>
            </div>

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
          </div>
        </div>

        {/* LEARNING ROADMAP SECTION */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-purple-500" />
              Your Learning Roadmap
            </h2>
            <p className="text-gray-600">Track your progress across all courses you've started</p>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold mb-2">No courses started yet</p>
              <p className="text-gray-400 mb-6">Explore our course library and start learning today!</p>
              <button
                onClick={() => onNavigate("discovery")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Discover Courses
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progress Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Total Courses</span>
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900">{enrolledCourses.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Completed</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-green-900">
                    {enrolledCourses.filter(c => c.status === 'completed').length}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">In Progress</span>
                    <PlayCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-purple-900">
                    {enrolledCourses.filter(c => c.status === 'in-progress').length}
                  </p>
                </div>
              </div>

              {/* Course Cards */}
              <div className="space-y-4">
                {enrolledCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => onNavigate("recorded", course)}
                  >
                    <div className="flex items-start gap-6">
                      {/* Course Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {course.avatar}
                        </div>
                      </div>

                      {/* Course Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                              {course.subject}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">with {course.teacher}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {course.status === 'completed' && (
                              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                            {course.status === 'in-progress' && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1">
                                <PlayCircle className="w-3 h-3" />
                                In Progress
                              </span>
                            )}
                            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                            <span>Progress</span>
                            <span className="font-semibold">{course.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Last watched: {new Date(course.lastWatched).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>Spent: ${course.totalSpent.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{course.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>
          )}
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
