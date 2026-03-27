import { Link } from "react-router-dom";
import { CodeBlock } from "../components/CodeBlock";

export function Home() {
  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero">
        <span className="hero-logo-text">ProxyPay</span>
        <h1>
          <span className="hero-badge">Payment Gateway</span>
          Payments{" "}
          <span className="gradient-text">ready to use</span>
        </h1>
        <p className="hero-subtitle">
          Complete platform for integrating payments via ProxyPay.
          PIX with QR Code, Invoice with redirect, status polling and
          billing management — all in a lightweight, typed system.
        </p>
        <div className="hero-actions">
          <Link to="/demo/pix" className="btn btn-primary">
            Demo PIX
          </Link>
          <Link to="/demo/invoice" className="btn btn-primary">
            Demo Invoice
          </Link>
          <Link to="/demo/billing" className="btn btn-primary">
            Demo Billing
          </Link>
          <Link to="/docs" className="btn btn-secondary">
            Documentation
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">&#9889;</div>
          <h3>QR Code PIX</h3>
          <p>
            Automatically generates QR Code via API. The customer scans and
            pays instantly.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#8635;</div>
          <h3>Automatic Polling</h3>
          <p>
            Checks payment status at configurable intervals. Detects
            payment, expiration and cancellation.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#128736;</div>
          <h3>Fully Typed</h3>
          <p>
            TypeScript interfaces for Customer, InvoiceItem and all
            API responses. Editor autocompletion included.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#127912;</div>
          <h3>Customizable</h3>
          <p>
            Modal with configurable CSS classes. Use your design system or
            the default styles.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#128230;</div>
          <h3>Zero Dependencies</h3>
          <p>
            Only React as peer dependency. No QR code, UI, or
            modal libs — all native.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#128640;</div>
          <h3>Lightweight</h3>
          <p>
            Under 8KB gzipped. ESM + CJS with tree-shaking. Production
            ready.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="quick-start">
        <h2>Quick Start</h2>
        <p className="quick-start-text">Install the package via npm:</p>
        <CodeBlock language="bash" code="npm install proxypay-react" />
        <p className="quick-start-text">Wrap your components with <code>ProxyPayProvider</code> and use <code>PixPayment</code> to accept PIX payments:</p>
        <CodeBlock code={`import { ProxyPayProvider, PixPayment } from "proxypay-react";

<ProxyPayProvider config={{
  baseUrl: "https://api.sandbox.proxypay.co.ao",
  clientId: "your-client-id",
  tenantId: "your-tenant",
}}>
  <PixPayment
    customer={customer}
    items={items}
    onSuccess={(status) => console.log("Paid!", status)}
  >
    <button>Pay with PIX</button>
  </PixPayment>
</ProxyPayProvider>`} />
      </section>
    </div>
  );
}
