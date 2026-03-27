import { useSearchParams, Link } from "react-router-dom";

export function PaymentComplete() {
  const [params] = useSearchParams();
  const status = params.get("status");
  const from = params.get("from");

  const isSuccess = status === "success" || status === "paid";

  const backTo = from === "billing" ? "/demo/billing" : "/demo/invoice";
  const backLabel = from === "billing" ? "Demo Billing" : "Demo Invoice";

  return (
    <div className="page" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center", paddingTop: 80 }}>
      <div style={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        background: isSuccess ? "rgba(20, 184, 166, 0.1)" : "rgba(239, 68, 68, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 24px",
        fontSize: 32,
      }}>
        {isSuccess ? "\u2713" : "\u2717"}
      </div>

      <h1 style={{
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 12,
      }}>
        {isSuccess ? "Payment Confirmed" : "Payment Cancelled"}
      </h1>

      <p style={{
        fontSize: 16,
        lineHeight: 1.6,
        marginBottom: 32,
      }}>
        {isSuccess
          ? "Your payment was processed successfully. You can close this page or go back to the demo."
          : "The payment was cancelled or not completed. You can try again."
        }
      </p>

      {status && (
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          borderRadius: 100,
          fontSize: 13,
          fontWeight: 600,
          background: isSuccess ? "rgba(20, 184, 166, 0.1)" : "rgba(239, 68, 68, 0.1)",
          color: isSuccess ? "#2dd4bf" : "#f87171",
          marginBottom: 32,
        }}>
          Status: {status}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        <Link to={backTo} className="btn btn-primary">
          Back to {backLabel}
        </Link>
        <Link to="/" className="btn btn-secondary">
          Home
        </Link>
      </div>
    </div>
  );
}
