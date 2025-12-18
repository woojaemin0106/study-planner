import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import MainPage from "./pages/MainPage.jsx";
import TimerPage from "./pages/TimerPage.jsx";
import ChallengesPage from "./pages/ChallengesPage.jsx";
import DaysLayout from "./pages/days/DaysLayout.jsx";
import DaysDailyPage from "./pages/days/DaysDailyPage.jsx";
import DaysWeeklyPage from "./pages/days/DaysWeeklyPage.jsx";
import DaysMonthlyPage from "./pages/days/DaysMonthlyPage.jsx";
function LoginPage() {
  return <div className="p-6">Login</div>;
}
function SignupPage() {
  return <div className="p-6">Signup</div>;
}

export default function App() {
  return (
    <>
      <NavBar />
      <div className="pt-16 min-h-screen bg-gray-50">
        <Routes>
          {/* Home */}
          <Route path="/" element={<MainPage />} />

          {/* Tabs */}
          <Route path="/Days" element={<DaysLayout />} />
          <Route path="/Days/daily" element={<DaysDailyPage />} />
          <Route path="/Days/weekly" element={<DaysWeeklyPage />} />
          <Route path="/Days/monthly" element={<DaysMonthlyPage />} />

          <Route path="/Timer" element={<TimerPage />} />
          <Route path="/Challenges" element={<ChallengesPage />} />

          {/* Auth */}
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Signup" element={<SignupPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
