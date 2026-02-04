import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AISessionDiscovery from './components/AISessionDiscovery';
import WalletConnect from './components/WalletConnect';
import PreSessionBrief from './components/PreSessionBrief';
import LiveSession from './components/LiveSession';
import SessionSummary from './components/SessionSummary';
import ReviewScreen from './components/ReviewScreen';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

type Screen =
  | 'landing'
  | 'discovery'
  | 'wallet'
  | 'preBrief'
  | 'liveSession'
  | 'summary'
  | 'review'
  | 'studentDashboard'
  | 'teacherDashboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [sessionData, setSessionData] = useState<any>(null);

  const navigate = (screen: Screen, data?: any) => {
    if (data) {
      if (screen === 'preBrief' || screen === 'liveSession') {
        setSelectedSession(data);
      } else if (screen === 'summary' || screen === 'review') {
        setSessionData(data);
      }
    }
    setCurrentScreen(screen);
  };

  return (
    <>
      {currentScreen === 'landing' && <LandingPage onNavigate={navigate} />}
      {currentScreen === 'discovery' && <AISessionDiscovery onNavigate={navigate} />}
      {currentScreen === 'wallet' && <WalletConnect onNavigate={navigate} />}
      {currentScreen === 'preBrief' && <PreSessionBrief session={selectedSession} onNavigate={navigate} />}
      {currentScreen === 'liveSession' && <LiveSession session={selectedSession} onNavigate={navigate} />}
      {currentScreen === 'summary' && <SessionSummary data={sessionData} onNavigate={navigate} />}
      {currentScreen === 'review' && <ReviewScreen data={sessionData} onNavigate={navigate} />}
      {currentScreen === 'studentDashboard' && <StudentDashboard onNavigate={navigate} />}
      {currentScreen === 'teacherDashboard' && <TeacherDashboard onNavigate={navigate} />}
    </>
  );
}

export default App;
