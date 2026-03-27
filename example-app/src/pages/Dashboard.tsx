import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../hooks/useStore";
import { useBalance } from "../hooks/useBalance";
import { Skeleton, SkeletonCards } from "../components/Skeleton";

export function Dashboard() {
  const { store } = useStore();
  const { balance, loading, error, loadBalance } = useBalance();

  useEffect(() => {
    loadBalance();
  }, [loadBalance]);

  if (loading) return (
    <div className="page admin-page">
      <Skeleton width="180px" height="28px" style={{ marginBottom: "24px" }} />
      <Skeleton width="300px" height="18px" style={{ marginBottom: "32px" }} />
      <SkeletonCards count={4} />
    </div>
  );
  if (error) return <div className="page admin-page"><p className="admin-error">{error}</p></div>;

  return (
    <div className="page admin-page">
      <h1>Dashboard</h1>

      {!store && (
        <div className="admin-alert">
          You don't have a store yet.{" "}
          <Link to="/admin/store">Create store</Link>
        </div>
      )}

      {store && (
        <div className="admin-store-badge">
          Store: <strong>{store.name}</strong> — Client ID: <code>{store.clientId}</code>
        </div>
      )}

      {/* Balance Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <span className="dashboard-card-label">Available Balance</span>
          <span className="dashboard-card-value">
            R$ {(balance?.balance ?? 0).toFixed(2)}
          </span>
          <button className="btn btn-primary dashboard-withdraw-btn">
            Withdraw
          </button>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Total Credits</span>
          <span className="dashboard-card-value success">
            R$ {(balance?.totalCredits ?? 0).toFixed(2)}
          </span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Total Debits</span>
          <span className="dashboard-card-value danger">
            R$ {(balance?.totalDebits ?? 0).toFixed(2)}
          </span>
        </div>
        <div className="dashboard-card">
          <span className="dashboard-card-label">Transactions</span>
          <span className="dashboard-card-value">
            {balance?.transactionCount ?? 0}
          </span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="dashboard-links">
        <Link to="/admin/store" className="dashboard-link-card">
          <strong>Store</strong>
          <span>Configure your store</span>
        </Link>
        <Link to="/admin/customers" className="dashboard-link-card">
          <strong>Customers</strong>
          <span>Manage customers</span>
        </Link>
        <Link to="/admin/invoices" className="dashboard-link-card">
          <strong>Invoices</strong>
          <span>View invoices</span>
        </Link>
        <Link to="/admin/billings" className="dashboard-link-card">
          <strong>Billings</strong>
          <span>Recurring charges</span>
        </Link>
      </div>
    </div>
  );
}
