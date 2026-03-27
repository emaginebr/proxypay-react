import { useState, useEffect } from "react";
import { useInvoice } from "../hooks/useInvoice";
import { SkeletonTable } from "../components/Skeleton";

const statusLabels: Record<number, string> = {
  1: "Pending",
  2: "Sent",
  3: "Paid",
  4: "Overdue",
  5: "Cancelled",
  6: "Expired",
};

const statusColors: Record<number, string> = {
  1: "badge-warning",
  2: "badge-info",
  3: "badge-success",
  4: "badge-danger",
  5: "badge-muted",
  6: "badge-muted",
};

export function InvoicesPage() {
  const { invoices, loading, error, loadInvoices } = useInvoice();
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadInvoices(page * pageSize, pageSize);
  }, [loadInvoices, page]);

  return (
    <div className="page admin-page">
      <h1>Invoices</h1>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <SkeletonTable rows={5} cols={6} />
      ) : invoices.length === 0 ? (
        <p className="admin-empty">No invoices found.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Number</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoiceId}>
                  <td>{inv.invoiceId}</td>
                  <td><code>{inv.invoiceNumber}</code></td>
                  <td>{inv.customer?.name ?? "—"}</td>
                  <td>
                    <span className={`badge ${statusColors[inv.status] ?? ""}`}>
                      {statusLabels[inv.status] ?? inv.status}
                    </span>
                  </td>
                  <td>{new Date(inv.dueDate).toLocaleDateString("en-US")}</td>
                  <td>{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("en-US") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-pagination">
        <button
          className="btn btn-secondary"
          disabled={page === 0}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </button>
        <span>Page {page + 1}</span>
        <button
          className="btn btn-secondary"
          disabled={invoices.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
