import { useNavigate, Link } from "react-router-dom";
import { LoginForm } from "nauth-react";

export function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">ProxyPay</span>
          <p className="auth-subtitle">Entre na sua conta para acessar o painel</p>
        </div>
        <LoginForm
          onSuccess={() => navigate("/")}
          showRememberMe
        />
        <p className="auth-footer-text">
          Nao tem uma conta? <Link to="/signup">Criar conta</Link>
        </p>
      </div>
    </div>
  );
}
