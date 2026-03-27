import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "nauth-react";

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="logo">
            ProxyPay React
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/docs">Docs</NavLink>
            <NavLink to="/demo/pix">Demo PIX</NavLink>
            <NavLink to="/demo/invoice">Demo Invoice</NavLink>
            <NavLink to="/demo/billing">Demo Billing</NavLink>
            {isAuthenticated && (
              <NavLink to="/admin/dashboard">Admin</NavLink>
            )}
            <a href="https://github.com/Emagine/proxypay-react" target="_blank" rel="noopener">
              GitHub
            </a>
            {isAuthenticated && user ? (
              <span className="nav-user">
                <span className="nav-user-name">{user.name || user.email}</span>
                <button onClick={handleLogout} className="nav-logout">Sair</button>
              </span>
            ) : (
              <NavLink to="/login">Login</NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <p>ProxyPay React &copy; 2026 Emagine. MIT License.</p>
      </footer>
    </div>
  );
}
