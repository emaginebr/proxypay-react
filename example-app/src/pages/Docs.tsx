import { CodeBlock } from "../components/CodeBlock";

export function Docs() {
  return (
    <div className="page docs-page">
      <h1>Documentation</h1>
      <p className="docs-intro">
        Complete guide on how to integrate <strong>proxypay-react</strong> into your
        project.
      </p>

      {/* Installation */}
      <section className="docs-section">
        <h2 id="installation">1. Installation</h2>
        <CodeBlock language="bash" code="npm install proxypay-react" />
        <p>
          The package requires <code>react &gt;= 18</code> and{" "}
          <code>react-dom &gt;= 18</code> as peer dependencies.
        </p>
      </section>

      {/* Provider */}
      <section className="docs-section">
        <h2 id="provider">2. ProxyPayProvider</h2>
        <p>
          Wrap your application (or the part that uses payments) with the provider.
          It provides the configuration for all child components.
        </p>
        <CodeBlock code={`import { ProxyPayProvider } from "proxypay-react";

function App() {
  return (
    <ProxyPayProvider
      config={{
        baseUrl: "https://api.sandbox.proxypay.co.ao",
        clientId: "50169143aa0e46b593dcf43adec0464e",
        tenantId: "my-company",
      }}
    >
      {/* your components here */}
    </ProxyPayProvider>
  );
}`} />

        <h3>ProxyPayConfig</h3>
        <table className="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>baseUrl</code></td>
              <td><code>string</code></td>
              <td>ProxyPay API base URL</td>
            </tr>
            <tr>
              <td><code>clientId</code></td>
              <td><code>string</code></td>
              <td>Client ID (32-char hex)</td>
            </tr>
            <tr>
              <td><code>tenantId</code></td>
              <td><code>string</code></td>
              <td>Tenant identifier (X-Tenant-Id header)</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* PixPayment */}
      <section className="docs-section">
        <h2 id="pix-payment">3. PixPayment</h2>
        <p>
          Main component for PIX payment. Renders a button (via{" "}
          <code>children</code>) and on click opens a modal with the QR Code,
          a field to copy the PIX code, and an expiration timer. Automatic status polling included.
        </p>
        <CodeBlock code={`import {
  PixPayment,
  type CustomerInfo,
  type InvoiceItem,
} from "proxypay-react";

const customer: CustomerInfo = {
  name: "Maria Santos",
  documentId: "98765432100",
  cellphone: "21988887777",
  email: "maria@email.com",
};

const items: InvoiceItem[] = [
  {
    id: "COURSE-001",
    description: "Advanced React Course",
    quantity: 1,
    unitPrice: 297.00,
    discount: 0,
  },
];

function Checkout() {
  return (
    <PixPayment
      customer={customer}
      items={items}
      pollInterval={10000}
      modalTitle="Complete Payment"
      onSuccess={(status) => {
        // Redirect to success page
        window.location.href = "/thank-you";
      }}
      onError={(error) => {
        alert("Error: " + error.message);
      }}
      onStatusChange={(status) => {
        console.log("Status updated:", status.statusText);
      }}
    >
      <button>Buy for R$ 297.00</button>
    </PixPayment>
  );
}`} />

        <h3>Props</h3>
        <table className="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>customer</code></td>
              <td><code>CustomerInfo</code></td>
              <td>—</td>
              <td>Customer data (required)</td>
            </tr>
            <tr>
              <td><code>items</code></td>
              <td><code>InvoiceItem[]</code></td>
              <td>—</td>
              <td>Payment items (required)</td>
            </tr>
            <tr>
              <td><code>pollInterval</code></td>
              <td><code>number</code></td>
              <td><code>10000</code></td>
              <td>Polling interval in ms</td>
            </tr>
            <tr>
              <td><code>modalTitle</code></td>
              <td><code>string</code></td>
              <td><code>"PIX Payment"</code></td>
              <td>Title displayed in the modal</td>
            </tr>
            <tr>
              <td><code>onSuccess</code></td>
              <td><code>(status) =&gt; void</code></td>
              <td>—</td>
              <td>Callback when payment is confirmed</td>
            </tr>
            <tr>
              <td><code>onError</code></td>
              <td><code>(error) =&gt; void</code></td>
              <td>—</td>
              <td>Callback on error</td>
            </tr>
            <tr>
              <td><code>onStatusChange</code></td>
              <td><code>(status) =&gt; void</code></td>
              <td>—</td>
              <td>Callback on each status check</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactNode</code></td>
              <td>—</td>
              <td>Button that triggers the payment</td>
            </tr>
            <tr>
              <td><code>overlayClassName</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>CSS class for the modal overlay</td>
            </tr>
            <tr>
              <td><code>modalClassName</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>CSS class for the modal container</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Hook */}
      <section className="docs-section">
        <h2 id="use-proxy-pay">4. useProxyPay Hook</h2>
        <p>
          For advanced scenarios, use the hook directly to access the
          API methods.
        </p>
        <CodeBlock code={`import { useProxyPay } from "proxypay-react";

function CustomPayment() {
  const { createQRCode, checkQRCodeStatus } = useProxyPay();

  async function handlePay() {
    const qr = await createQRCode(customer, items);
    console.log(qr.brCode);        // PIX code
    console.log(qr.brCodeBase64);   // base64 image

    const status = await checkQRCodeStatus(qr.invoiceId);
    console.log(status.paid);       // true/false
    console.log(status.statusText); // "Pending", "Paid", etc.
  }

  return <button onClick={handlePay}>Pay</button>;
}`} />
      </section>

      {/* Interfaces */}
      <section className="docs-section">
        <h2 id="interfaces">5. Interfaces</h2>

        <h3>CustomerInfo</h3>
        <CodeBlock language="typescript" code={`interface CustomerInfo {
  name: string;        // Full name
  documentId: string;  // CPF (11 digits, no formatting)
  cellphone: string;   // Phone number
  email: string;       // Email address
}`} />

        <h3>InvoiceItem</h3>
        <CodeBlock language="typescript" code={`interface InvoiceItem {
  id: string;          // Product identifier
  description: string; // Description
  quantity: number;    // Quantity (> 0)
  unitPrice: number;   // Unit price in BRL
  discount: number;    // Discount (>= 0)
}`} />

        <h3>QRCodeResponse</h3>
        <CodeBlock language="typescript" code={`interface QRCodeResponse {
  invoiceId: number;      // Invoice ID
  invoiceNumber: string;  // Invoice number
  brCode: string;         // PIX copy-paste code
  brCodeBase64: string;   // QR Code as PNG base64 image
  expiredAt?: string;     // Expiration date (ISO 8601)
}`} />

        <h3>QRCodeStatusResponse</h3>
        <CodeBlock language="typescript" code={`interface QRCodeStatusResponse {
  invoiceId: number;
  invoiceNumber: string;
  paid: boolean;                // true if paid
  status: number;               // 1-6 (enum)
  statusText: InvoiceStatus;    // "Pending" | "Paid" | "Expired" | ...
  expiresAt?: string;
}

type InvoiceStatus =
  | "Pending" | "Sent" | "Paid"
  | "Overdue" | "Cancelled" | "Expired";`} />
      </section>
    </div>
  );
}
