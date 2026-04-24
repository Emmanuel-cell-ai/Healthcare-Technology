import React from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputsField.jsx";
import Button from "../components/Button.jsx";
import FormContainer from "../components/FormContainer.jsx";
import CareDiv from "../assets/CareDiv.PNG";   // ✅ logo import

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signup submitted:", { fullName, email, password });
    navigate("/login");
  };

  return (
    <FormContainer title="Create an Account">
      <img src={CareDiv} alt="CareDiv Logo" className="logo" />
      <form onSubmit={handleSignup}>
        <InputField type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <Button type="submit">Sign Up</Button>
      </form>
      <p>Already have an account? <span onClick={() => navigate("/login")}>Login</span></p>
    </FormContainer>
  );
}

export default Signup;
