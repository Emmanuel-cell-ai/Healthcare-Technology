import React from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/shared/InputsField.jsx";
import Button from "../components/shared/Button.jsx";
import FormContainer from "../components/shared/Alert.jsx";

function Verification() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    console.log("Verification code:", code);
    navigate("/reset-password");
  };

  return (
    <FormContainer title="Check Your Email">
      <p>Enter the 6-digit code to verify your account.</p>
      <form onSubmit={handleVerify}>
        <InputField type="text" placeholder="Enter code" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button type="submit">Verify</Button>
      </form>
      <p>Didn’t receive code? <span onClick={() => console.log("Resend code")}>Resend Code</span></p>
    </FormContainer>
  );
}

export default Verification;
