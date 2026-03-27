import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="page home-page">
      {/* Hero */}
      <section className="hero">
        <h1>ProxyPay React</h1>
        <p className="hero-subtitle">
          Componentes React prontos para integrar pagamentos via ProxyPay.
          <br />
          PIX com QR Code, Invoice com redirecionamento, polling de status e
          modal — tudo em um pacote leve e tipado.
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
            Documentacao
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature-card">
          <div className="feature-icon">&#9889;</div>
          <h3>QR Code PIX</h3>
          <p>
            Gera QR Code automaticamente via API. O cliente escaneia e paga
            na hora.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#8635;</div>
          <h3>Polling Automatico</h3>
          <p>
            Verifica o status do pagamento em intervalos configuraveis. Detecta
            pagamento, expiracao e cancelamento.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#128736;</div>
          <h3>Totalmente Tipado</h3>
          <p>
            Interfaces TypeScript para Customer, InvoiceItem e todas as
            respostas da API. Autocompletar no editor.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#127912;</div>
          <h3>Customizavel</h3>
          <p>
            Modal com classes CSS configuraveis. Use seu design system ou os
            estilos padrao.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#128230;</div>
          <h3>Zero Dependencias</h3>
          <p>
            Apenas React como peer dependency. Sem libs de QR code, UI ou
            modal — tudo nativo.
          </p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">&#128640;</div>
          <h3>Leve</h3>
          <p>
            Menos de 8KB gzipped. ESM + CJS com tree-shaking. Pronto para
            producao.
          </p>
        </div>
      </section>

      {/* Quick Start */}
      <section className="quick-start">
        <h2>Quick Start</h2>
        <pre className="code-block">
          <code>npm install proxypay-react</code>
        </pre>
        <pre className="code-block">
          <code>{`import { ProxyPayProvider, PixPayment } from "proxypay-react";

<ProxyPayProvider config={{
  baseUrl: "https://api.sandbox.proxypay.co.ao",
  clientId: "seu-client-id",
  tenantId: "seu-tenant",
}}>
  <PixPayment
    customer={customer}
    items={items}
    onSuccess={(status) => console.log("Pago!", status)}
  >
    <button>Pagar com PIX</button>
  </PixPayment>
</ProxyPayProvider>`}</code>
        </pre>
      </section>
    </div>
  );
}
