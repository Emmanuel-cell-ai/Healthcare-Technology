import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Verification from "./pages/Verification.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import SuccessScreen from "./pages/SuccessScreen.jsx";
import "./styles/theme.css"; // global theme

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/success" element={<SuccessScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
