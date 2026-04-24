// import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputsField.jsx";
import Button from "../components/Button.jsx";
import FormContainer from "../components/FormContainer.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
    navigate("/onboarding");
  };

  return (
    <FormContainer title="Welcome Back!">
      <p>Login to your account</p>
      <form onSubmit={handleLogin}>
        <InputField
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Login</Button>
      </form>
      <p onClick={() => navigate("/forgot-password")}>Forgot Password?</p>
      <p>
        Don’t have an account?{" "}
        <span onClick={() => navigate("/signup")}>Sign Up</span>
      </p>
    </FormContainer>
  );
}

export default Login;
