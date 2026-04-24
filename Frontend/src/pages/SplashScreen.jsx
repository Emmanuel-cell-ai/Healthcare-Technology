import React from "react";
import { useNavigate } from "react-router-dom";
import CareDiv from "../assets/CareDiv.PNG";

function SplashScreen() {
  const navigate = useNavigate();

  return (
    <div className="splash-container">
      <img src={CareDiv} alt="CareDiv Logo" className="logo" />
      <h1>CareDiv</h1>
      <p>Track. Remind. Care</p>
      <p>Your Health, Your Way</p>
      <button onClick={() => navigate("/onboarding")}>
        Get Started
      </button>
    </div>
  );
}

export default SplashScreen;
