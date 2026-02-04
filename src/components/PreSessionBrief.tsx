// import { Sparkles, Target, Clock, Shield, Zap } from 'lucide-react';

// interface PreSessionBriefProps {
//   session: any;
//   onNavigate: (screen: string, data?: any) => void;
// }

// export default function PreSessionBrief({ session, onNavigate }: PreSessionBriefProps) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-8">
//       <div className="max-w-3xl w-full">
//         <button
//           onClick={() => onNavigate('discovery')}
//           className="mb-8 text-blue-600 hover:text-blue-700 font-medium"
//         >
//           ← Back to Discovery
//         </button>

//         <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-10">
//           <div className="text-center mb-8">
//             <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white font-bold text-2xl">
//               {session?.avatar || 'SC'}
//             </div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">{session?.teacher}</h1>
//             <p className="text-lg text-gray-600">{session?.subject}</p>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-8">
//             <div className="flex items-center space-x-2 mb-4">
//               <Sparkles className="w-5 h-5 text-purple-500" />
//               <h2 className="font-bold text-gray-800">AI Pre-Session Brief</h2>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-start space-x-3">
//                 <Target className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-800 mb-1">Session Goals</h3>
//                   <p className="text-sm text-gray-600">
//                     Master jazz chord progressions and learn improvisation techniques over ii-V-I patterns
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <Clock className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-800 mb-1">Estimated Duration</h3>
//                   <p className="text-sm text-gray-600">
//                     20-25 minutes for this topic. AI will monitor your progress and suggest optimal end time.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-start space-x-3">
//                 <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
//                 <div>
//                   <h3 className="font-semibold text-gray-800 mb-1">What to Prepare</h3>
//                   <p className="text-sm text-gray-600">
//                     Have your instrument ready. No greeting time needed - we start learning immediately.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4 mb-8">
//             <div className="bg-white/50 rounded-xl p-4 text-center">
//               <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
//               <p className="text-sm font-semibold text-gray-800">90s Free Preview</p>
//               <p className="text-xs text-gray-500">Risk-free start</p>
//             </div>

//             <div className="bg-white/50 rounded-xl p-4 text-center">
//               <Zap className="w-6 h-6 text-green-500 mx-auto mb-2" />
//               <p className="text-sm font-semibold text-gray-800">$0.15/min</p>
//               <p className="text-xs text-gray-500">After preview</p>
//             </div>

//             <div className="bg-white/50 rounded-xl p-4 text-center">
//               <Target className="w-6 h-6 text-purple-500 mx-auto mb-2" />
//               <p className="text-sm font-semibold text-gray-800">AI Tracked</p>
//               <p className="text-xs text-gray-500">Value meter</p>
//             </div>
//           </div>

//           <button
//             onClick={() => onNavigate('liveSession', session)}
//             className="w-full py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all transform hover:scale-[1.02]"
//           >
//             Start Metered Session
//           </button>

//           <p className="text-center text-sm text-gray-500 mt-4">
//             You can end the session anytime. Only pay for time used.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


















import {
  Sparkles,
  Target,
  Clock,
  Shield,
  Zap,
  Star,
  Users,
  FileText,
  Globe,
  RefreshCcw
} from 'lucide-react';

interface PreSessionBriefProps {
  session: any;
  onNavigate: (screen: string, data?: any) => void;
}

export default function PreSessionBrief({ session, onNavigate }: PreSessionBriefProps) {
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => onNavigate('discovery')}
          className="mb-8 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Discovery
        </button>

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-10">
          {/* HEADER */}
          <div className="flex items-start space-x-6 mb-10">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              {session.avatar}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-1">
                {session.subject}
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                by {session.teacher}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-800">
                    {session.rating}
                  </span>
                  <span>({session.students} learners)</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Globe className="w-4 h-4" />
                  <span>{session.language}</span>
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{session.total_length_min} min total content</span>
                </div>

                {session.verified && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">Verified Instructor</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              About this recorded session
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {session.description}
            </p>
          </div>

          {/* AI LEARNING BRIEF */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 mb-10">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="font-bold text-gray-800">
                AI Learning Brief
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <Target className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    What you’ll learn
                  </h3>
                  <ul className="text-sm text-gray-600 list-disc list-inside">
                    {session.outcomes.map((o: string, i: number) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-green-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">
                    Best value window
                  </h3>
                  <p className="text-sm text-gray-600">
                    Most learners stop between{' '}
                    <strong>
                      {session.recommended_min}–{session.recommended_max} minutes
                    </strong>{' '}
                    after reaching peak understanding.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* TRANSPARENCY STRIP */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <InfoCard icon={Zap} title="Recorded" text="Resume anytime" />
            <InfoCard
              icon={Dollar}
              title={`$${session.rate}/min`}
              text="Pay only while watching"
            />
            <InfoCard
              icon={Shield}
              title={`Max ~$${session.max_charge}`}
              text="Escrow protected"
            />
            <InfoCard
              icon={RefreshCcw}
              title="Auto Refund"
              text="Unused time returned"
            />
          </div>

          {/* INSTRUCTOR */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Instructor
            </h2>
            <p className="text-gray-700">{session.instructor_bio}</p>
          </div>

          {/* CTA */}
          <button
            onClick={() => onNavigate('recordedSession', session)}
            className="w-full py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-semibold rounded-xl hover:shadow-xl transition-all"
          >
            Start Recorded Session
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            You can stop anytime. You’ll only be charged for minutes watched.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helper ---------- */

function InfoCard({
  icon: Icon,
  title,
  text
}: {
  icon: any;
  title: string;
  text: string;
}) {
  return (
    <div className="bg-white/50 rounded-xl p-4 text-center">
      <Icon className="w-6 h-6 text-blue-500 mx-auto mb-2" />
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      <p className="text-xs text-gray-500">{text}</p>
    </div>
  );
}

function Dollar(props: any) {
  return <Zap {...props} />;
}
