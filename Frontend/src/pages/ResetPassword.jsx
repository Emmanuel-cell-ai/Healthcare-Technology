import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputsField.jsx";
import Button from "../components/Button.jsx";
import FormContainer from "../components/FormContainer.jsx";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset:", newPassword);
    navigate("/success");
  };

  return (
    <FormContainer title="Reset Password">
      <p>Create a new password for your account.</p>
      <form onSubmit={handleReset}>
        <InputField type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <Button type="submit">Reset Password</Button>
      </form>
    </FormContainer>
  );
}

export default ResetPassword;
