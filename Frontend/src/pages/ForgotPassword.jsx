import React from "react";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputsField.jsx";
import Button from "../components/Button.jsx";
import FormContainer from "../components/FormContainer.jsx";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendCode = (e) => {
    e.preventDefault();
    console.log("Reset code sent to:", email);
    navigate("/verification");
  };

  return (
    <FormContainer title="Forgot Password?">
      <p>Enter your email and we’ll send you a code to reset your password.</p>
      <form onSubmit={handleSendCode}>
        <InputField type="email" placeholder="yourname@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit">Send Code</Button>
      </form>
      <p onClick={() => navigate("/login")}>Remember your password? Back to Login</p>
    </FormContainer>
  );
}

export default ForgotPassword;
