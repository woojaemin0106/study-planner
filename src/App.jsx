import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";

import MainPage from "./pages/MainPage.jsx";
import DaysPage from "./pages/DaysPage.jsx";
import TimerPage from "./pages/TimerPage.jsx";
import ChallengesPage from "./pages/ChallengesPage.jsx";

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

      <Routes>
        {/* Home */}
        <Route path="/" element={<MainPage />} />

        {/* Tabs */}
        <Route path="/Days" element={<DaysPage />} />
        <Route path="/Timer" element={<TimerPage />} />
        <Route path="/Challenges" element={<ChallengesPage />} />

        {/* Auth */}
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/Signup" element={<SignupPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
