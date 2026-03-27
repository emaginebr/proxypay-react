import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "nauth-react";

const adminLinks = [
  { to: "/admin/dashboard", icon: "\u25A3", label: "Dashboard" },
  { to: "/admin/store", icon: "\u2302", label: "Store" },
  { to: "/admin/customers", icon: "\u2617", label: "Customers" },
  { to: "/admin/invoices", icon: "\u2637", label: "Invoices" },
  { to: "/admin/billings", icon: "\u21BB", label: "Billings" },
];

const demoLinks = [
  { to: "/demo/pix", icon: "\u26A1", label: "PIX" },
  { to: "/demo/invoice", icon: "\u2709", label: "Invoice" },
  { to: "/demo/billing", icon: "\u2B6E", label: "Billing" },
];

function NavDropdown({ label, items }: { label: string; items: typeof demoLinks }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isActive = items.some((item) => location.pathname === item.to);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        className={`nav-dropdown-trigger${isActive ? " active" : ""}`}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>
      {open && (
        <div className="nav-dropdown-menu">
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function Layout() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="logo">
            <span className="logo-text">ProxyPay</span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/docs">Docs</NavLink>
            <NavDropdown label="Demo" items={demoLinks} />
            {isAuthenticated && (
              <NavLink to="/admin/dashboard">Admin</NavLink>
            )}
            {isAuthenticated && user ? (
              <span className="nav-user">
                <span className="nav-user-name">{user.name || user.email}</span>
                <button onClick={handleLogout} className="nav-logout">Logout</button>
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
            <span className="sidebar-label">Panel</span>
            {adminLinks.map((link) => (
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
            ProxyPay &copy; 2026 Emagine. MIT License.
            {" · "}
            <a href="https://github.com/emaginebr/proxypay-react" target="_blank" rel="noopener">GitHub</a>
          </footer>
        </>
      )}
    </div>
  );
}
