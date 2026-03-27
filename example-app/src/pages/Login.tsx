import { useNavigate } from "react-router-dom";
import { LoginForm } from "nauth-react";

export function Login() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
      <LoginForm
        onSuccess={() => navigate("/")}
        showRememberMe
      />
    </div>
  );
}
