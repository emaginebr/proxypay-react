import { useState } from "react";
import {
  ProxyPayProvider,
  InvoicePayment,
  PaymentMethod,
  type CustomerInfo,
  type InvoiceItem,
} from "proxypay-react";

const config = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  clientId: import.meta.env.VITE_CLIENT_ID,
  tenantId: import.meta.env.VITE_TENANT_ID,
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.Pix]: "PIX",
  [PaymentMethod.Boleto]: "Boleto",
  [PaymentMethod.CreditCard]: "Cartao de Credito",
  [PaymentMethod.DebitCard]: "Cartao de Debito",
};

export function DemoInvoice() {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "Joao Silva",
    documentId: "12345678900",
    cellphone: "11999999999",
    email: "joao@email.com",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "PROD-001",
      description: "Consultoria - 10 horas",
      quantity: 10,
      unitPrice: 150.0,
      discount: 0,
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CreditCard,
  );
  const [completionUrl, setCompletionUrl] = useState(
    window.location.origin + "/demo/invoice?status=success",
  );
  const [returnUrl, setReturnUrl] = useState(
    window.location.origin + "/demo/invoice",
  );
  const [notes, setNotes] = useState("");
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString("pt-BR");
    setLog((prev) => [`[${time}] ${msg}`, ...prev].slice(0, 20));
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice - item.discount,
    0,
  );

  const updateItem = (field: keyof InvoiceItem, value: string) => {
    setItems((prev) => {
      const item = { ...prev[0] };
      if (
        field === "quantity" ||
        field === "unitPrice" ||
        field === "discount"
      ) {
        (item as Record<string, unknown>)[field] = parseFloat(value) || 0;
      } else {
        (item as Record<string, unknown>)[field] = value;
      }
      return [item];
    });
  };

  return (
    <ProxyPayProvider config={config}>
      <div className="page demo-page">
        <h1>Demo Invoice Payment</h1>
        <p className="demo-intro">
          Configure os dados abaixo e clique no botao para testar o componente
          <code> InvoicePayment</code>. Voce sera redirecionado para a pagina de
          pagamento.
        </p>

        <div className="demo-grid">
          {/* Form */}
          <div className="demo-form">
            <h2>Dados do Cliente</h2>
            <div className="form-grid">
              <label>
                <span>Nome</span>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, name: e.target.value }))
                  }
                />
              </label>
              <label>
                <span>CPF</span>
                <input
                  type="text"
                  value={customer.documentId}
                  onChange={(e) =>
                    setCustomer((c) => ({
                      ...c,
                      documentId: e.target.value,
                    }))
                  }
                  maxLength={11}
                />
              </label>
              <label>
                <span>Telefone</span>
                <input
                  type="text"
                  value={customer.cellphone}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, cellphone: e.target.value }))
                  }
                />
              </label>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={customer.email}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, email: e.target.value }))
                  }
                />
              </label>
            </div>

            <h2>Item</h2>
            <div className="form-grid">
              <label>
                <span>Descricao</span>
                <input
                  type="text"
                  value={items[0].description}
                  onChange={(e) => updateItem("description", e.target.value)}
                />
              </label>
              <label>
                <span>Preco (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  value={items[0].unitPrice}
                  onChange={(e) => updateItem("unitPrice", e.target.value)}
                />
              </label>
              <label>
                <span>Quantidade</span>
                <input
                  type="number"
                  min="1"
                  value={items[0].quantity}
                  onChange={(e) => updateItem("quantity", e.target.value)}
                />
              </label>
              <label>
                <span>Desconto (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  value={items[0].discount}
                  onChange={(e) => updateItem("discount", e.target.value)}
                />
              </label>
            </div>

            <h2>Configuracao</h2>
            <div className="form-grid">
              <label>
                <span>Metodo de Pagamento</span>
                <select
                  value={paymentMethod}
                  onChange={(e) =>
                    setPaymentMethod(Number(e.target.value) as PaymentMethod)
                  }
                >
                  {Object.entries(paymentMethodLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Notas (opcional)</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observacoes na fatura"
                />
              </label>
              <label>
                <span>URL de Conclusao</span>
                <input
                  type="text"
                  value={completionUrl}
                  onChange={(e) => setCompletionUrl(e.target.value)}
                />
              </label>
              <label>
                <span>URL de Retorno</span>
                <input
                  type="text"
                  value={returnUrl}
                  onChange={(e) => setReturnUrl(e.target.value)}
                />
              </label>
            </div>

            <div className="demo-total">
              Total: <strong>R$ {total.toFixed(2)}</strong>
            </div>

            <InvoicePayment
              customer={customer}
              items={items}
              paymentMethod={paymentMethod}
              completionUrl={completionUrl}
              returnUrl={returnUrl}
              notes={notes || undefined}
              onError={(err) => addLog(`Erro: ${err.message}`)}
            >
              <button className="btn btn-primary demo-pay-btn">
                Pagar R$ {total.toFixed(2)} com{" "}
                {paymentMethodLabels[paymentMethod]}
              </button>
            </InvoicePayment>
          </div>

          {/* Log */}
          <div className="demo-log">
            <h2>Event Log</h2>
            <div className="demo-info-box">
              <p>
                Ao clicar em "Pagar", a API cria uma fatura e redireciona
                para a pagina de pagamento do AbacatePay.
              </p>
              <p>
                Apos o pagamento, voce sera redirecionado para a{" "}
                <strong>URL de Conclusao</strong>.
              </p>
              <p>
                Se cancelar, volta para a <strong>URL de Retorno</strong>.
              </p>
            </div>
            <div className="log-entries">
              {log.length === 0 && (
                <p className="log-empty">
                  Clique em "Pagar" para ver os eventos aqui.
                </p>
              )}
              {log.map((entry, i) => (
                <div key={i} className="log-entry">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProxyPayProvider>
  );
}
