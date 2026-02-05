import { useEffect, useRef, useState } from 'react';
import {
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  FileText,
  Sparkles,
  X,
  MessageCircle,
  ThumbsUp,
  User,
} from 'lucide-react';

import { getUserWallet, chargeSession } from '../utils/wallet';

/* ---------- TYPES ---------- */
interface RecordedSessionProps {
  session: any;
  onNavigate: (screen: string, data?: any) => void;
}

interface TranscriptItem {
  timestamp: string;
  text: string;
  raw_seconds: number;
}

/* ---------- COMPONENT ---------- */
export default function RecordedSession({
  session,
  onNavigate,
}: RecordedSessionProps) {
  /* ---------------- STATE ---------------- */
  const [seconds, setSeconds] = useState(0);
  const [cost, setCost] = useState(0);
  const [isBilling, setIsBilling] = useState(false);
  const [autoStopped, setAutoStopped] = useState(false);

  const [studentBalance, setStudentBalance] = useState(0);
  const [insufficientBalance, setInsufficientBalance] = useState(false);

  const [finalValueScore, setFinalValueScore] = useState<number | null>(null);
  const [finalEngagement, setFinalEngagement] = useState<number | null>(null);

  const [transcript, setTranscript] = useState<TranscriptItem[]>([]);
  const [loadingTranscript, setLoadingTranscript] = useState(false);

  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [askingAI, setAskingAI] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const watchedSecondsRef = useRef<Set<number>>(new Set());
  
  // Free preview period state
  const [freePeriodActive, setFreePeriodActive] = useState(true);
  const [freeSecondsWatched, setFreeSecondsWatched] = useState(0);
  const [freeCountdown, setFreeCountdown] = useState(30);
  const lastVideoTimeRef = useRef(0);

  // Community comments (mock data)
  const [comments] = useState([
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "SC",
      comment: "Excellent explanation! The practical examples really helped me understand the concepts better. Definitely worth the investment.",
      likes: 24,
      time: "2 days ago"
    },
    {
      id: 2,
      user: "Michael Torres",
      avatar: "MT",
      comment: "Great session overall. The pacing was perfect for me, finished it in about 15 minutes and felt like I learned a lot.",
      likes: 18,
      time: "5 days ago"
    },
    {
      id: 3,
      user: "Emily Park",
      avatar: "EP",
      comment: "The instructor is very clear and engaging. I appreciate the step-by-step breakdown. Highly recommend!",
      likes: 31,
      time: "1 week ago"
    },
    {
      id: 4,
      user: "David Kim",
      avatar: "DK",
      comment: "Good content but I wished there were more advanced topics covered. Still a solid foundation though!",
      likes: 12,
      time: "1 week ago"
    },
    {
      id: 5,
      user: "Jessica Wu",
      avatar: "JW",
      comment: "This helped me so much! I was struggling with this topic and now it all makes sense. Thank you!",
      likes: 27,
      time: "2 weeks ago"
    }
  ]);

  /* ---------------- CONFIG ---------------- */
  const FREE_PREVIEW_SECONDS = 30;

  /* ---------------- CONFIG ---------------- */
  const rate = session?.rate ?? 0.15;
  const maxCharge = session?.max_charge ?? Infinity;
  const optimalMaxSec = (session?.recommended_max ?? 20) * 60;
  const INITIAL_SESSION_FEE = 1/5*maxCharge;

  /* ---------------- CONFIG ---------------- */
  const STUDENT_ID = "student_1"; // TODO: Get from auth context
  const TEACHER_ID = session?.teacher_id || session?.teacher?.toLowerCase().replace(/\s+/g, "_") || "teacher_1";

  /* ---------------- LOAD WALLET ---------------- */
  useEffect(() => {
    getUserWallet(STUDENT_ID)
      .then((data) => setStudentBalance(data.balance || 0))
      .catch(console.error);
  }, []);

  /* ---------------- FETCH TRANSCRIPT ---------------- */
  useEffect(() => {
    if (!session?.videoUrl) return;

    setLoadingTranscript(true);

    fetch(
      `http://localhost:8000/get-formatted-transcript?video_url=`
    )
      .then((res) => res.json())
      .then((data) => setTranscript(data.transcript || []))
      .catch(console.error)
      .finally(() => setLoadingTranscript(false));
  }, [session.videoUrl]);

  /* ---------------- VIDEO EVENTS ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => {
      if (insufficientBalance) {
        video.pause();
        alert('Insufficient balance');
        return;
      }
      if (!autoStopped) setIsBilling(true);
    };

    const onPause = () => setIsBilling(false);
    const onEnd = () => setIsBilling(false);
    
    // Detect seeking/skipping to check if user skips past free period
    const onSeeking = () => {
      if (freePeriodActive && video.currentTime > FREE_PREVIEW_SECONDS) {
        // User skipped past free period, start billing
        setFreePeriodActive(false);
        setFreeSecondsWatched(FREE_PREVIEW_SECONDS);
        setFreeCountdown(0);
        setCost(INITIAL_SESSION_FEE);
      }
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnd);
    video.addEventListener('seeking', onSeeking);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnd);
      video.removeEventListener('seeking', onSeeking);
    };
  }, [autoStopped, insufficientBalance, freePeriodActive, FREE_PREVIEW_SECONDS]);

  /* ---------------- BILLING TIMER ---------------- */
  useEffect(() => {
    if (!isBilling) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      const currentSecond = Math.floor(video.currentTime);

      // During free period, track free seconds but don't charge
      if (freePeriodActive) {
        if (!watchedSecondsRef.current.has(currentSecond)) {
          watchedSecondsRef.current.add(currentSecond);
          setFreeSecondsWatched((prev) => prev + 1);
          setFreeCountdown((prev) => Math.max(0, prev - 1));
          
          // Check if free period has ended
          if (freeSecondsWatched + 1 >= FREE_PREVIEW_SECONDS) {
            setFreePeriodActive(false);
            setCost((c) => c + INITIAL_SESSION_FEE);
          }
        }
        return; // Don't charge during free period
      }

      // After free period, start billing normally
      const nextCharge = rate / 60;

      if (cost + nextCharge > studentBalance) {
        setIsBilling(false);
        setInsufficientBalance(true);
        video.pause();
        return;
      }

      setSeconds((s) => s + 1);

      if (!watchedSecondsRef.current.has(currentSecond)) {
        watchedSecondsRef.current.add(currentSecond);
        setCost((c) => Math.min(c + nextCharge, maxCharge));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isBilling, rate, maxCharge, cost, studentBalance, freePeriodActive, freeSecondsWatched, FREE_PREVIEW_SECONDS]);

  /* ---------------- AUTO STOP ---------------- */
  useEffect(() => {
    if (seconds >= optimalMaxSec && isBilling) {
      setIsBilling(false);
      setAutoStopped(true);
      videoRef.current?.pause();
    }
  }, [seconds, optimalMaxSec, isBilling]);

  /* ---------------- METRICS ---------------- */
  useEffect(() => {
    if (!isBilling && seconds > 0 && finalValueScore === null) {
      const vs = Math.min(100, Math.round((seconds / optimalMaxSec) * 100));
      const eng = Math.max(60, 100 - Math.abs(vs - 85));
      setFinalValueScore(vs);
      setFinalEngagement(eng);
    }
  }, [isBilling, seconds, optimalMaxSec, finalValueScore]);

  /* ---------------- HELPERS ---------------- */
  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(
      s % 60
    ).padStart(2, '0')}`;

  const valueScore =
    finalValueScore ??
    Math.min(100, Math.round((seconds / optimalMaxSec) * 100));

  const engagement =
    finalEngagement ??
    Math.max(60, 100 - Math.abs(valueScore - 85));

  /* ---------------- ASK AI ---------------- */
  const askAI = async () => {
    if (!aiQuestion.trim()) return;

    setAskingAI(true);
    setAiAnswer('');

    const res = await fetch('http://localhost:8000/ask-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        video_url: "",
        user_query: aiQuestion,
      }),
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      setAiAnswer((prev) => prev + decoder.decode(value));
    }

    setAskingAI(false);
  };




  const camRef = useRef<HTMLVideoElement>(null);
  const camCanvasRef = useRef<HTMLCanvasElement>(null);

  const [focusStatus, setFocusStatus] = useState<
    'FOCUSED' | 'LOOKING_AWAY' | 'NO_FACE' | 'INIT'
  >('INIT');

  const distractionCountRef = useRef(0);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (camRef.current) camRef.current.srcObject = stream;
      })
      .catch(console.error);

    return () => {
      if (camRef.current?.srcObject) {
        (camRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isBilling) return;

    const interval = setInterval(async () => {
      const video = camRef.current;
      const canvas = camCanvasRef.current;
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0, 320, 240);

      const blob = await new Promise<Blob | null>((res) =>
        canvas.toBlob(res, 'image/jpeg', 0.7)
      );

      if (!blob) return;

      try {
        const resp = await fetch('http://localhost:8000/face', {
          method: 'POST',
          body: blob,
        });

        const data = await resp.json();
        setFocusStatus(data.status);

        // --- auto intervention ---
        if (data.status !== 'FOCUSED') {
          distractionCountRef.current += 1;

          if (distractionCountRef.current >= 5) {
            videoRef.current?.pause();
            setIsBilling(false);
            alert('⚠️ Please focus on the session');
            distractionCountRef.current = 0;
          }
        } else {
          distractionCountRef.current = 0;
        }
      } catch (e) {
        console.error(e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isBilling]);






  /* ---------------- END SESSION ---------------- */
  const endSession = async () => {
    if (cost <= 0) {
      // No charge if cost is 0
      onNavigate('summary', {
        timeUsed: seconds,
        cost: 0,
        teacher: session.teacher,
        subject: session.subject,
        aiNotes: session.outcomes || [],
        valueScore,
        engagement,
        studentBalance: studentBalance,
        teacherReceived: 0,
        platformCut: 0,
      });
      return;
    }

    try {
      const result = await chargeSession(cost, STUDENT_ID, TEACHER_ID, session?.id);
      const walletData = await getUserWallet(STUDENT_ID);

      onNavigate('summary', {
        timeUsed: seconds,
        cost,
        teacher: session.teacher,
        subject: session.subject,
        aiNotes: session.outcomes || [],
        valueScore,
        engagement,
        studentBalance: walletData.balance,
        teacherReceived: result.teacher_received,
        platformCut: result.platform_cut,
      });
    } catch (err: any) {
      console.error('Session charge error:', err);
      const msg = err?.message;
      const text = typeof msg === 'string' ? msg : (msg ? JSON.stringify(msg) : 'Failed to charge session. Please check your balance and try again.');
      alert(text);
    }
  };

  

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HEADER */}
      {/* FACE MONITOR (hidden) */}
      <video
        ref={camRef}
        autoPlay
        playsInline
        muted
        width={320}
        height={240}
        className="hidden"
      />

      <canvas
        ref={camCanvasRef}
        width={320}
        height={240}
        className="hidden"
      />

      <div className="px-6 py-4 border-b border-gray-700 flex justify-between">
        <div>
          <p className="font-semibold">{session.teacher}</p>
          <p className="text-sm text-gray-400">{session.subject}</p>
        </div>

        <button
          onClick={endSession}
          className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl"
        >
          <X size={16} />
          <span>End Session</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* VIDEO */}
        <div className="lg:col-span-2 space-y-6">
          {/* Free Preview Countdown Banner */}
          {freePeriodActive && (
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 rounded-full w-3 h-3 animate-pulse" />
                <span className="font-semibold text-green-400">
                  Free Preview Active
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="text-green-400" size={20} /> 
                <span className="text-2xl font-bold text-green-400">
                  {freeCountdown}s
                </span>
                <span className="text-sm text-gray-400">remaining</span>
              </div>
            </div>
          )}

          <div className="aspect-video bg-black rounded-2xl overflow-hidden">
            <video
              ref={videoRef}
              src={session.videoUrl}
              controls
              className="w-full h-full"
            />
          </div>

          <div className="bg-purple-500/10 rounded-2xl p-5 border border-purple-500/30">
            <Sparkles className="text-purple-400" />
            <p className="text-sm mt-2">
              Optimal learning happens within {session.recommended_min}–
              {session.recommended_max} minutes.
            </p>
          </div>

          {/* COMMUNITY FORUM */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center space-x-3 mb-5">
              <MessageCircle className="text-blue-400" size={24} />
              <h3 className="text-xl font-semibold">Community Discussion</h3>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold">{comment.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">{comment.user}</p>
                          <p className="text-xs text-gray-500">{comment.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed mb-3">
                        {comment.comment}
                      </p>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 text-xs text-gray-400 hover:text-blue-400 transition-colors">
                          <ThumbsUp size={14} />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment Section */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Share your thoughts about this session..."
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl p-3 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none resize-none"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          {/* METRICS */}
          <div className="bg-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between">
              <Clock /> Duration
              <span>{formatTime(seconds)}</span>
            </div>
            <div className="flex justify-between">
              <DollarSign /> Cost
              <span>${cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <TrendingUp /> Trend
              <span>{valueScore}%</span>
            </div>
            <div className="flex justify-between">
              <Activity /> Activity
              <span>{engagement}%</span>
            </div>
            <div className="text-sm text-gray-400">
              Remaining: ${studentBalance.toFixed(2)}
            </div>
          </div>

          {/* OUTCOMES */}
          <div className="bg-gray-800 p-5 rounded-2xl">
            <FileText />
            <ul className="text-sm mt-2 space-y-1">
              {session.outcomes?.map((o: string, i: number) => (
                <li key={i}>• {o}</li>
              ))}
            </ul>
          </div>

          {/* TRANSCRIPT */}
          <div className="bg-gray-800 p-5 rounded-2xl max-h-[300px] overflow-y-auto">
            <h3 className="font-semibold mb-2">Transcript</h3>
            {loadingTranscript && (
              <p className="text-sm text-gray-400">Loading transcript…</p>
            )}
            {!loadingTranscript &&
              transcript.map((t, i) => (
                <div
                  key={i}
                  className="text-sm mb-2 cursor-pointer hover:text-purple-400"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = t.raw_seconds;
                      videoRef.current.play();
                    }
                  }}
                >
                  <span className="text-purple-400 mr-2">
                    [{t.timestamp}]
                  </span>
                  {t.text}
                </div>
              ))}
          </div>
          
          <div className="flex justify-between">
            <span>Focus</span>
            <span
              className={
                focusStatus === 'FOCUSED'
                  ? 'text-green-400'
                  : focusStatus === 'LOOKING_AWAY'
                  ? 'text-red-400'
                  : 'text-yellow-400'
              }
            >
              {focusStatus}
            </span>
          </div>


          {/* ASK AI */}
          <div className="bg-gray-800 p-5 rounded-2xl space-y-3">
            <h3 className="font-semibold">Ask AI about this video</h3>

            <textarea
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              placeholder="Ask a question or request a summary…"
              className="w-full bg-gray-900 text-white p-3 rounded-xl text-sm resize-none"
              rows={3}
            />

            <button
              onClick={askAI}
              disabled={askingAI}
              className="px-4 py-2 bg-purple-600 rounded-xl text-sm disabled:opacity-50"
            >
              {askingAI ? 'Thinking…' : 'Ask AI'}
            </button>

            {aiAnswer && (
              <div className="bg-black/40 p-3 rounded-xl text-sm whitespace-pre-wrap">
                {aiAnswer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
