import { useNavigate } from "react-router-dom";
import { RegisterForm } from "nauth-react";

export function Signup() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
      <RegisterForm
        onSuccess={() => navigate("/")}
      />
    </div>
  );
}
