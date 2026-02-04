import { useEffect, useRef, useState } from 'react';
import {
  Clock,
  DollarSign,
  TrendingUp,
  Activity,
  FileText,
  Sparkles,
  X,
} from 'lucide-react';

import { getWallets, chargeWallet } from '../utils/wallet';

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

  /* ---------------- CONFIG ---------------- */
  const rate = session?.rate ?? 0.15;
  const maxCharge = session?.max_charge ?? Infinity;
  const optimalMaxSec = (session?.recommended_max ?? 20) * 60;

  /* ---------------- LOAD WALLET ---------------- */
  useEffect(() => {
    getWallets()
      .then((data) => setStudentBalance(data.wallets.id1.balance))
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

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnd);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnd);
    };
  }, [autoStopped, insufficientBalance]);

  /* ---------------- BILLING TIMER ---------------- */
  useEffect(() => {
    if (!isBilling) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      const currentSecond = Math.floor(video.currentTime);
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
  }, [isBilling, rate, maxCharge, cost, studentBalance]);

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
    }, 600);

    return () => clearInterval(interval);
  }, [isBilling]);






  /* ---------------- END SESSION ---------------- */
  const endSession = async () => {
    try {
      const result = await chargeWallet(cost);
      const walletData = await getWallets();

      onNavigate('summary', {
        timeUsed: seconds,
        cost,
        teacher: session.teacher,
        subject: session.subject,
        aiNotes: session.outcomes || [],
        valueScore,
        engagement,
        studentBalance: walletData.wallets.id1.balance,
        teacherReceived: result.teacher_received,
        platformCut: result.platform_cut,
      });
    } catch (err: any) {
      alert(err.message || 'Charge failed');
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
        </div>

        {/* SIDEBAR */}
        <div className="space-y-4">
          {/* METRICS */}
          <div className="bg-gray-800 p-5 rounded-2xl space-y-3">
            <div className="flex justify-between">
              <Clock />
              <span>{formatTime(seconds)}</span>
            </div>
            <div className="flex justify-between">
              <DollarSign />
              <span>${cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <TrendingUp />
              <span>{valueScore}%</span>
            </div>
            <div className="flex justify-between">
              <Activity />
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
