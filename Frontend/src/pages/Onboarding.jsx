import React from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="onboarding-container">
      <h2>Welcome to CareDiv</h2>
      <p>Let’s help you build a better health routine.</p>
      <ul>
        <li>Stay on top of your medication</li>
        <li>Track your symptoms daily</li>
        <li>Prepare for better consultation</li>
      </ul>
      <button onClick={() => navigate("/signup")}>
        Next
      </button>
    </div>
  );
}

export default Onboarding;
