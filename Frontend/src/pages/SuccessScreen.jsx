import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button.jsx";
import FormContainer from "../components/FormContainer.jsx";


function SuccessScreen() {
  const navigate = useNavigate();

  return (
    <FormContainer title="Password Reset Successfully!">
      <p>Your password has been changed. You can now log in with your new password.</p>
      <Button onClick={() => navigate("/login")}>Back to Login</Button>
    </FormContainer>
  );
}

export default SuccessScreen;
