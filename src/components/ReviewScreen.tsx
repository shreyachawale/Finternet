// import { useState } from 'react';
// import { Star, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

// interface ReviewScreenProps {
//   data: any;
//   onNavigate: (screen: string) => void;
// }

// export default function ReviewScreen({ data, onNavigate }: ReviewScreenProps) {
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [review, setReview] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   const engagementScore = data?.engagement || 92;
//   const credibilityScore = engagementScore > 80 ? 95 : engagementScore > 60 ? 75 : 50;

//   const handleSubmit = () => {
//     setSubmitted(true);
//     setTimeout(() => {
//       onNavigate('studentDashboard');
//     }, 2000);
//   };

//   if (submitted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-8">
//         <div className="max-w-md w-full text-center">
//           <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-bounce">
//             <CheckCircle className="w-12 h-12 text-white" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-800 mb-3">Review Submitted!</h2>
//           <p className="text-gray-600 mb-2">Thank you for your feedback</p>
//           <p className="text-sm text-blue-600 font-semibold">+10 Learning Efficiency Points</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
//       <div className="max-w-2xl mx-auto">
//         <button
//           onClick={() => onNavigate('studentDashboard')}
//           className="mb-8 text-blue-600 hover:text-blue-700 font-medium"
//         >
//           ← Skip for now
//         </button>

//         <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-10">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Rate Your Session</h1>
//           <p className="text-gray-600 text-center mb-8">with {data?.teacher}</p>

//           <div className="flex justify-center space-x-3 mb-8">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 key={star}
//                 onMouseEnter={() => setHoverRating(star)}
//                 onMouseLeave={() => setHoverRating(0)}
//                 onClick={() => setRating(star)}
//                 className="transform hover:scale-110 transition-transform"
//               >
//                 <Star
//                   className={`w-12 h-12 ${
//                     star <= (hoverRating || rating)
//                       ? 'fill-yellow-400 text-yellow-400'
//                       : 'text-gray-300'
//                   }`}
//                 />
//               </button>
//             ))}
//           </div>

//           <div className="mb-6">
//             <label className="block text-sm font-semibold text-gray-700 mb-3">
//               Share your experience
//             </label>
//             <textarea
//               value={review}
//               onChange={(e) => setReview(e.target.value)}
//               placeholder="What did you learn? How was the teacher?"
//               className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//               rows={4}
//             />
//           </div>

//           <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-gray-800 flex items-center space-x-2">
//                 <TrendingUp className="w-5 h-5 text-blue-500" />
//                 <span>Review Credibility Score</span>
//               </h3>
//               <span className={`text-2xl font-bold ${
//                 credibilityScore > 80 ? 'text-green-600' :
//                 credibilityScore > 60 ? 'text-yellow-600' : 'text-red-600'
//               }`}>
//                 {credibilityScore}%
//               </span>
//             </div>

//             <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-4">
//               <div
//                 className={`h-full transition-all ${
//                   credibilityScore > 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
//                   credibilityScore > 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
//                   'bg-gradient-to-r from-red-400 to-red-600'
//                 }`}
//                 style={{ width: `${credibilityScore}%` }}
//               ></div>
//             </div>

//             <div className="space-y-2 text-sm">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600 flex items-center space-x-2">
//                   <CheckCircle className="w-4 h-4 text-green-500" />
//                   <span>High engagement during session</span>
//                 </span>
//                 <span className="text-green-600 font-semibold">+40%</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600 flex items-center space-x-2">
//                   <CheckCircle className="w-4 h-4 text-green-500" />
//                   <span>Verified learning time</span>
//                 </span>
//                 <span className="text-green-600 font-semibold">+35%</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600 flex items-center space-x-2">
//                   <CheckCircle className="w-4 h-4 text-green-500" />
//                   <span>Trusted learner badge</span>
//                 </span>
//                 <span className="text-green-600 font-semibold">+20%</span>
//               </div>
//             </div>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
//             <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
//             <p className="text-sm text-blue-800">
//               Your high credibility score means this review will have stronger weight in teacher ratings and you'll earn bonus Learning Efficiency points.
//             </p>
//           </div>

//           <button
//             onClick={handleSubmit}
//             disabled={rating === 0}
//             className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             Submit Review
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from 'react';
import { Star, TrendingUp, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface ReviewScreenProps {
  data: any; // Contains teacher name, studentId, courseId, watchTime, totalTime
  onNavigate: (screen: string) => void;
}

export default function ReviewScreen({ data, onNavigate }: ReviewScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  // Integration States
  const [trustData, setTrustData] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // 1. INTEGRATION: Call the Trust Engine (Python Backend 2)
  useEffect(() => {
    const verifyReview = async () => {
      if (rating === 0) return;
      
      setIsVerifying(true);
      try {
        const response = await fetch('http://localhost:8000/verify-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            review_text: review,
            star_rating: rating,
            watch_time_min: data?.watchTime || 15, // Using real data from session
            total_time_min: data?.totalTime || 30
          }),
        });
        const result = await response.json();
        setTrustData(result);
      } catch (error) {
        console.error("Failed to verify review:", error);
      } finally {
        setIsVerifying(false);
      }
    };

    // Debounce API calls to avoid hitting backend on every keystroke
    const timeoutId = setTimeout(verifyReview, 500);
    return () => clearTimeout(timeoutId);
  }, [review, rating, data]);

  // 2. INTEGRATION: Call the Wallet System (Python Backend 1)
  const handleSubmit = async () => {
    try {
      // First, process the payment/charge
      const chargeResponse = await fetch('http://localhost:8000/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data?.sessionPrice || 20.00 // The cost of the lesson
        }),
      });

      if (chargeResponse.ok) {
        setSubmitted(true);
        setTimeout(() => {
          onNavigate('studentDashboard');
        }, 2000);
      } else {
        alert("Transaction failed. Please check your balance.");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const credibilityScore = trustData?.trust_score || 0;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Review & Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Funds have been transferred to {data?.teacher}</p>
          <p className="text-sm text-blue-600 font-semibold">+10 Learning Efficiency Points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => onNavigate('studentDashboard')}
          className="mb-8 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Skip for now
        </button>

        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">Rate Your Session</h1>
          <p className="text-gray-600 text-center mb-8">with {data?.teacher}</p>

          <div className="flex justify-center space-x-3 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transform hover:scale-110 transition-transform"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3 flex justify-between">
              <span>Share your experience</span>
              {isVerifying && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What did you learn? How was the teacher?"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
          </div>

          {/* REAL TRUST ENGINE RESULTS */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span>Review Credibility Score</span>
              </h3>
              <span className={`text-2xl font-bold ${
                credibilityScore > 80 ? 'text-green-600' :
                credibilityScore > 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {credibilityScore}%
              </span>
            </div>

            <div className="h-3 bg-white/50 rounded-full overflow-hidden mb-4">
              <div
                className={`h-full transition-all duration-500 ${
                  credibilityScore > 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  credibilityScore > 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${credibilityScore}%` }}
              ></div>
            </div>

            {/* DYNAMIC FLAGS FROM BACKEND */}
            <div className="space-y-2 text-sm">
              {trustData?.flags.length > 0 ? (
                trustData.flags.map((flag: string, i: number) => (
                  <div key={i} className="flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{flag}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Review looks authentic and verified.</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || trustData?.status === "Rejected"}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {trustData?.status === "Rejected" ? "Review Too Low Quality" : "Submit Review & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
}