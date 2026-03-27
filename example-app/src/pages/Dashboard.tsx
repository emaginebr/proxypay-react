import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNAuth } from "nauth-react";
import { fetchMyBalance, fetchMyStore, type BalanceInfo, type StoreInfo } from "../services/adminApi";

export function Dashboard() {
  const { token } = useNAuth();
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([fetchMyBalance(token), fetchMyStore(token)])
      .then(([b, s]) => {
        setBalance(b);
        setStore(s);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="page admin-page"><p>Carregando...</p></div>;
  if (error) return <div className="page admin-page"><p className="admin-error">{error}</p></div>;

  return (
    <div className="page admin-page">
      <h1>Dashboard</h1>

      {!store && (
        <div className="admin-alert">
          Voce ainda nao possui uma loja.{" "}
          <Link to="/admin/store">Criar loja</Link>
        </div>
      )}

      {store && (
        <div className="admin-store-badge">
          Loja: <strong>{store.name}</strong> — Client ID: <code>{store.clientId}</code>
        </div>
      )}

      {/* Balance Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-label">Saldo Disponivel</span>
          <span className="dashboard-card-value">
            R$ {(balance?.balance ?? 0).toFixed(2)}
          </span>
          <button className="btn btn-primary dashboard-withdraw-btn">
            Sacar
          </button>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Total Creditos</span>
          <span className="dashboard-card-value success">
            R$ {(balance?.totalCredits ?? 0).toFixed(2)}
          </span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Total Debitos</span>
          <span className="dashboard-card-value danger">
            R$ {(balance?.totalDebits ?? 0).toFixed(2)}
          </span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Transacoes</span>
          <span className="dashboard-card-value">
            {balance?.transactionCount ?? 0}
          </span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="dashboard-links">
        <Link to="/admin/store" className="dashboard-link-card">
          <strong>Loja</strong>
          <span>Configurar sua loja</span>
        </Link>
        <Link to="/admin/customers" className="dashboard-link-card">
          <strong>Clientes</strong>
          <span>Gerenciar clientes</span>
        </Link>
        <Link to="/admin/invoices" className="dashboard-link-card">
          <strong>Faturas</strong>
          <span>Ver faturas</span>
        </Link>
        <Link to="/admin/billings" className="dashboard-link-card">
          <strong>Assinaturas</strong>
          <span>Cobracas recorrentes</span>
        </Link>
      </div>
    </div>
  );
}
