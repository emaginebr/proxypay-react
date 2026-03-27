import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "nauth-react";

const adminLinks = [
  { to: "/admin/dashboard", icon: "\u25A3", label: "Dashboard" },
  { to: "/admin/store", icon: "\u2302", label: "Loja" },
  { to: "/admin/customers", icon: "\u2617", label: "Clientes" },
  { to: "/admin/invoices", icon: "\u2637", label: "Faturas" },
  { to: "/admin/billings", icon: "\u21BB", label: "Assinaturas" },
];

const demoLinks = [
  { to: "/demo/pix", icon: "\u26A1", label: "PIX" },
  { to: "/demo/invoice", icon: "\u2709", label: "Invoice" },
  { to: "/demo/billing", icon: "\u2B6E", label: "Billing" },
];

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/demo");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="logo">
            <span className="logo-dot" />
            ProxyPay
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/docs">Docs</NavLink>
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

      {isAdminRoute && isAuthenticated ? (
        <div className="admin-shell">
          <aside className="sidebar">
            <span className="sidebar-label">Painel</span>
            {adminLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                <span className="sidebar-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
            <span className="sidebar-label">Demos</span>
            {demoLinks.map((link) => (
              <NavLink key={link.to} to={link.to}>
                <span className="sidebar-icon">{link.icon}</span>
                {link.label}
              </NavLink>
            ))}
          </aside>
          <div className="admin-content">
            <main className="main">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <>
          <main className="main">
            <Outlet />
          </main>
          <footer className="footer">
            <p>ProxyPay React &copy; 2026 Emagine. MIT License.</p>
          </footer>
        </>
      )}
    </div>
  );
}
