import { useState } from "react";
import {
  ProxyPayProvider,
  BillingPayment,
  BillingFrequency,
  PaymentMethod,
  type CustomerInfo,
  type BillingItem,
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

const frequencyLabels: Record<BillingFrequency, string> = {
  [BillingFrequency.Monthly]: "Monthly",
  [BillingFrequency.Quarterly]: "Quarterly",
  [BillingFrequency.Semiannual]: "Semiannual",
  [BillingFrequency.Annual]: "Annual",
};

export function DemoBilling() {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "John Doe",
    documentId: "12345678900",
    cellphone: "11999999999",
    email: "john@email.com",
  });

  const [items, setItems] = useState<BillingItem[]>([
    {
      description: "Pro Plan",
      quantity: 1,
      unitPrice: 99.9,
      discount: 0,
    },
  ]);

  const [frequency, setFrequency] = useState<BillingFrequency>(
    BillingFrequency.Monthly,
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CreditCard,
  );
  const [billingStartDate, setBillingStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  );
  const completionUrl = window.location.origin + "/demo/complete?status=success&from=billing";
  const returnUrl = window.location.origin + "/demo/billing";
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

  const updateItem = (field: keyof BillingItem, value: string) => {
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
      {redirecting && <FullscreenLoading message="Creating subscription and redirecting..." />}
      <div className="page demo-page">
        <h1>Demo Billing Payment</h1>
        <p className="demo-intro">
          Configure the data below and click the button to test the
          <code> BillingPayment</code> component (recurring subscription). You will be
          redirected to the payment page.
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

            <h2>Plan</h2>
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

            <h2>Subscription Configuration</h2>
            <div className="form-grid">
              <label>
                <span>Frequency</span>
                <select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(Number(e.target.value) as BillingFrequency)
                  }
                >
                  {Object.entries(frequencyLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
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
                <span>Start Date</span>
                <input
                  type="date"
                  value={billingStartDate}
                  onChange={(e) => setBillingStartDate(e.target.value)}
                />
              </label>
            </div>

            <div className="demo-total">
              {frequencyLabels[frequency]}:{" "}
              <strong>R$ {total.toFixed(2)}</strong>
            </div>

            <BillingPayment
              customer={customer}
              items={items}
              frequency={frequency}
              paymentMethod={paymentMethod}
              billingStartDate={billingStartDate + "T00:00:00"}
              completionUrl={completionUrl}
              returnUrl={returnUrl}
              onError={(err) => {
                setRedirecting(false);
                addLog(`Error: ${err.message}`);
              }}
            >
              <button
                className="btn btn-primary demo-pay-btn"
                onClick={() => setRedirecting(true)}
              >
                Subscribe {frequencyLabels[frequency].toLowerCase()} — R${" "}
                {total.toFixed(2)}
              </button>
            </BillingPayment>
          </div>

          {/* Log */}
          <div className="demo-log">
            <h2>Event Log</h2>
            <div className="demo-info-box">
              <p>
                When you click "Subscribe", the API creates a recurring charge and
                redirects to the AbacatePay payment page.
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
                  Click "Subscribe" to see events here.
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
