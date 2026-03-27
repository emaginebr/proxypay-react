export function Docs() {
  return (
    <div className="page docs-page">
      <h1>Documentacao</h1>
      <p className="docs-intro">
        Guia completo de como integrar o <strong>proxypay-react</strong> no seu
        projeto.
      </p>

      {/* Instalacao */}
      <section className="docs-section">
        <h2 id="instalacao">1. Instalacao</h2>
        <pre className="code-block">
          <code>npm install proxypay-react</code>
        </pre>
        <p>
          O pacote requer <code>react &gt;= 18</code> e{" "}
          <code>react-dom &gt;= 18</code> como peer dependencies.
        </p>
      </section>

      {/* Provider */}
      <section className="docs-section">
        <h2 id="provider">2. ProxyPayProvider</h2>
        <p>
          Envolva sua aplicacao (ou a parte que usa pagamentos) com o provider.
          Ele fornece a configuracao para todos os componentes filhos.
        </p>
        <pre className="code-block">
          <code>{`import { ProxyPayProvider } from "proxypay-react";

function App() {
  return (
    <ProxyPayProvider
      config={{
        baseUrl: "https://api.sandbox.proxypay.co.ao",
        clientId: "50169143aa0e46b593dcf43adec0464e",
        tenantId: "minha-empresa",
      }}
    >
      {/* seus componentes aqui */}
    </ProxyPayProvider>
  );
}`}</code>
        </pre>

        <h3>ProxyPayConfig</h3>
        <table className="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Tipo</th>
              <th>Descricao</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>baseUrl</code></td>
              <td><code>string</code></td>
              <td>URL base da API ProxyPay</td>
            </tr>
            <tr>
              <td><code>clientId</code></td>
              <td><code>string</code></td>
              <td>ID do cliente (32 caracteres hex)</td>
            </tr>
            <tr>
              <td><code>tenantId</code></td>
              <td><code>string</code></td>
              <td>Identificador do tenant (header X-Tenant-Id)</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* PixPayment */}
      <section className="docs-section">
        <h2 id="pix-payment">3. PixPayment</h2>
        <p>
          Componente principal para pagamento PIX. Renderiza um botao (via{" "}
          <code>children</code>) e ao clicar abre um modal com o QR Code, campo
          para copiar o codigo PIX e timer de expiracao. Faz polling automatico
          do status.
        </p>
        <pre className="code-block">
          <code>{`import {
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
    id: "CURSO-001",
    description: "Curso de React Avancado",
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
      modalTitle="Finalizar Pagamento"
      onSuccess={(status) => {
        // Redirecionar para pagina de sucesso
        window.location.href = "/obrigado";
      }}
      onError={(error) => {
        alert("Erro: " + error.message);
      }}
      onStatusChange={(status) => {
        console.log("Status atualizado:", status.statusText);
      }}
    >
      <button>Comprar por R$ 297,00</button>
    </PixPayment>
  );
}`}</code>
        </pre>

        <h3>Props</h3>
        <table className="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Tipo</th>
              <th>Padrao</th>
              <th>Descricao</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>customer</code></td>
              <td><code>CustomerInfo</code></td>
              <td>—</td>
              <td>Dados do cliente (obrigatorio)</td>
            </tr>
            <tr>
              <td><code>items</code></td>
              <td><code>InvoiceItem[]</code></td>
              <td>—</td>
              <td>Itens do pagamento (obrigatorio)</td>
            </tr>
            <tr>
              <td><code>pollInterval</code></td>
              <td><code>number</code></td>
              <td><code>10000</code></td>
              <td>Intervalo de polling em ms</td>
            </tr>
            <tr>
              <td><code>modalTitle</code></td>
              <td><code>string</code></td>
              <td><code>"Pagamento PIX"</code></td>
              <td>Titulo exibido no modal</td>
            </tr>
            <tr>
              <td><code>onSuccess</code></td>
              <td><code>(status) =&gt; void</code></td>
              <td>—</td>
              <td>Callback quando pagamento confirmado</td>
            </tr>
            <tr>
              <td><code>onError</code></td>
              <td><code>(error) =&gt; void</code></td>
              <td>—</td>
              <td>Callback em caso de erro</td>
            </tr>
            <tr>
              <td><code>onStatusChange</code></td>
              <td><code>(status) =&gt; void</code></td>
              <td>—</td>
              <td>Callback a cada verificacao de status</td>
            </tr>
            <tr>
              <td><code>children</code></td>
              <td><code>ReactNode</code></td>
              <td>—</td>
              <td>Botao que dispara o pagamento</td>
            </tr>
            <tr>
              <td><code>overlayClassName</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>Classe CSS do overlay do modal</td>
            </tr>
            <tr>
              <td><code>modalClassName</code></td>
              <td><code>string</code></td>
              <td>—</td>
              <td>Classe CSS do container do modal</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Hook */}
      <section className="docs-section">
        <h2 id="use-proxy-pay">4. useProxyPay Hook</h2>
        <p>
          Para cenarios avancados, use o hook diretamente para acessar os
          metodos da API.
        </p>
        <pre className="code-block">
          <code>{`import { useProxyPay } from "proxypay-react";

function CustomPayment() {
  const { createQRCode, checkQRCodeStatus } = useProxyPay();

  async function handlePay() {
    const qr = await createQRCode(customer, items);
    console.log(qr.brCode);        // codigo PIX
    console.log(qr.brCodeBase64);   // imagem base64

    const status = await checkQRCodeStatus(qr.invoiceId);
    console.log(status.paid);       // true/false
    console.log(status.statusText); // "Pending", "Paid", etc.
  }

  return <button onClick={handlePay}>Pagar</button>;
}`}</code>
        </pre>
      </section>

      {/* Interfaces */}
      <section className="docs-section">
        <h2 id="interfaces">5. Interfaces</h2>

        <h3>CustomerInfo</h3>
        <pre className="code-block">
          <code>{`interface CustomerInfo {
  name: string;        // Nome completo
  documentId: string;  // CPF (11 digitos, sem formatacao)
  cellphone: string;   // Telefone
  email: string;       // Email
}`}</code>
        </pre>

        <h3>InvoiceItem</h3>
        <pre className="code-block">
          <code>{`interface InvoiceItem {
  id: string;          // Identificador do produto
  description: string; // Descricao
  quantity: number;    // Quantidade (> 0)
  unitPrice: number;   // Preco unitario em BRL
  discount: number;    // Desconto (>= 0)
}`}</code>
        </pre>

        <h3>QRCodeResponse</h3>
        <pre className="code-block">
          <code>{`interface QRCodeResponse {
  invoiceId: number;      // ID da fatura
  invoiceNumber: string;  // Numero da fatura
  brCode: string;         // Codigo PIX copia-e-cola
  brCodeBase64: string;   // QR Code como imagem PNG base64
  expiredAt?: string;     // Data de expiracao (ISO 8601)
}`}</code>
        </pre>

        <h3>QRCodeStatusResponse</h3>
        <pre className="code-block">
          <code>{`interface QRCodeStatusResponse {
  invoiceId: number;
  invoiceNumber: string;
  paid: boolean;                // true se pago
  status: number;               // 1-6 (enum)
  statusText: InvoiceStatus;    // "Pending" | "Paid" | "Expired" | ...
  expiresAt?: string;
}

type InvoiceStatus =
  | "Pending" | "Sent" | "Paid"
  | "Overdue" | "Cancelled" | "Expired";`}</code>
        </pre>
      </section>
    </div>
  );
}
