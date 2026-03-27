import { useState } from "react";
import {
  ProxyPayProvider,
  InvoicePayment,
  PaymentMethod,
  type CustomerInfo,
  type InvoiceItem,
} from "proxypay-react";
import { FullscreenLoading } from "../components/FullscreenLoading";

const config = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  clientId: import.meta.env.VITE_CLIENT_ID,
  tenantId: import.meta.env.VITE_TENANT_ID,
};

const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.Pix]: "PIX",
  [PaymentMethod.Boleto]: "Boleto",
  [PaymentMethod.CreditCard]: "Credit Card",
  [PaymentMethod.DebitCard]: "Debit Card",
};

export function DemoInvoice() {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "John Doe",
    documentId: "12345678900",
    cellphone: "11999999999",
    email: "john@email.com",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "PROD-001",
      description: "Consulting - 10 hours",
      quantity: 10,
      unitPrice: 150.0,
      discount: 0,
    },
  ]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CreditCard,
  );
  const completionUrl = window.location.origin + "/demo/complete?status=success&from=invoice";
  const returnUrl = window.location.origin + "/demo/invoice";
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  });
  const [redirecting, setRedirecting] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    const time = new Date().toLocaleTimeString("en-US");
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
      {redirecting && <FullscreenLoading message="Creating invoice and redirecting..." />}
      <div className="page demo-page">
        <h1>Demo Invoice Payment</h1>
        <p className="demo-intro">
          Configure the data below and click the button to test the
          <code> InvoicePayment</code> component. You will be redirected to the
          payment page.
        </p>

        <div className="demo-grid">
          {/* Form */}
          <div className="demo-form">
            <h2>Customer Data</h2>
            <div className="form-grid">
              <label>
                <span>Name</span>
                <input
                  type="text"
                  value={customer.name}
                  onChange={(e) =>
                    setCustomer((c) => ({ ...c, name: e.target.value }))
                  }
                />
              </label>
              <label>
                <span>Document ID</span>
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
                <span>Phone</span>
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
                <span>Description</span>
                <input
                  type="text"
                  value={items[0].description}
                  onChange={(e) => updateItem("description", e.target.value)}
                />
              </label>
              <label>
                <span>Price (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  value={items[0].unitPrice}
                  onChange={(e) => updateItem("unitPrice", e.target.value)}
                />
              </label>
              <label>
                <span>Quantity</span>
                <input
                  type="number"
                  min="1"
                  value={items[0].quantity}
                  onChange={(e) => updateItem("quantity", e.target.value)}
                />
              </label>
              <label>
                <span>Discount (R$)</span>
                <input
                  type="number"
                  step="0.01"
                  value={items[0].discount}
                  onChange={(e) => updateItem("discount", e.target.value)}
                />
              </label>
            </div>

            <h2>Configuration</h2>
            <div className="form-grid">
              <label>
                <span>Payment Method</span>
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
                <span>Due Date</span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </label>
              <label>
                <span>Notes (optional)</span>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Invoice notes"
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
              dueDate={dueDate}
              onError={(err) => {
                setRedirecting(false);
                addLog(`Error: ${err.message}`);
              }}
            >
              <button
                className="btn btn-primary demo-pay-btn"
                onClick={() => setRedirecting(true)}
              >
                Pay R$ {total.toFixed(2)} with{" "}
                {paymentMethodLabels[paymentMethod]}
              </button>
            </InvoicePayment>
          </div>

          {/* Log */}
          <div className="demo-log">
            <h2>Event Log</h2>
            <div className="demo-info-box">
              <p>
                When you click "Pay", the API creates an invoice and redirects
                to the AbacatePay payment page.
              </p>
              <p>
                After payment, you will be redirected to the{" "}
                <strong>Completion URL</strong>.
              </p>
              <p>
                If cancelled, you return to the <strong>Return URL</strong>.
              </p>
            </div>
            <div className="log-entries">
              {log.length === 0 && (
                <p className="log-empty">
                  Click "Pay" to see events here.
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
