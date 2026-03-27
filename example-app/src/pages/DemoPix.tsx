import { useState } from "react";
import {
  ProxyPayProvider,
  PixPayment,
  type CustomerInfo,
  type InvoiceItem,
  type QRCodeStatusResponse,
} from "proxypay-react";

const config = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  clientId: import.meta.env.VITE_CLIENT_ID,
  tenantId: import.meta.env.VITE_TENANT_ID,
};

export function DemoPix() {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "John Doe",
    documentId: "12345678900",
    cellphone: "11999999999",
    email: "john@email.com",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "PROD-001",
      description: "ProxyPay T-Shirt",
      quantity: 1,
      unitPrice: 49.9,
      discount: 0,
    },
  ]);

  const [pollInterval, setPollInterval] = useState(10000);
  const [lastStatus, setLastStatus] = useState<QRCodeStatusResponse | null>(
    null,
  );
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
      if (field === "quantity" || field === "unitPrice" || field === "discount") {
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
        <h1>Interactive Demo</h1>
        <p className="demo-intro">
          Configure the data below and click the button to test the
          <code> PixPayment</code> component in real time.
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
                    setCustomer((c) => ({ ...c, documentId: e.target.value }))
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
            <label>
              <span>Polling Interval (ms)</span>
              <input
                type="number"
                step="1000"
                min="3000"
                value={pollInterval}
                onChange={(e) => setPollInterval(parseInt(e.target.value) || 10000)}
              />
            </label>

            <div className="demo-total">
              Total: <strong>R$ {total.toFixed(2)}</strong>
            </div>

            <PixPayment
              customer={customer}
              items={items}
              pollInterval={pollInterval}
              modalTitle="PIX Payment - Demo"
              onSuccess={(status) => {
                setLastStatus(status);
                addLog(`Paid! Invoice: ${status.invoiceNumber}`);
              }}
              onError={(err) => addLog(`Error: ${err.message}`)}
              onStatusChange={(status) =>
                addLog(`Status: ${status.statusText}`)
              }
            >
              <button className="btn btn-primary demo-pay-btn">
                Pay R$ {total.toFixed(2)} with PIX
              </button>
            </PixPayment>
          </div>

          {/* Log */}
          <div className="demo-log">
            <h2>Event Log</h2>
            {lastStatus && (
              <div className="demo-status-badge">
                Last status: <strong>{lastStatus.statusText}</strong>
              </div>
            )}
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
