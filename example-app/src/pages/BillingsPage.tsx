import { useState, useEffect } from "react";
import { useBilling } from "../hooks/useBilling";
import { SkeletonTable } from "../components/Skeleton";

const frequencyLabels: Record<number, string> = {
  1: "Monthly",
  2: "Quarterly",
  3: "Semiannual",
  4: "Annual",
};

const paymentLabels: Record<number, string> = {
  1: "PIX",
  2: "Boleto",
  3: "Credit Card",
  4: "Debit Card",
};

const statusLabels: Record<number, string> = {
  1: "Active",
  2: "Paused",
  3: "Cancelled",
  4: "Completed",
};

export function BillingsPage() {
  const { billings, loading, error, loadBillings } = useBilling();
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadBillings(page * pageSize, pageSize);
  }, [loadBillings, page]);

  return (
    <div className="page admin-page">
      <h1>Billings</h1>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <SkeletonTable rows={5} cols={7} />
      ) : billings.length === 0 ? (
        <p className="admin-empty">No billings found.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Frequency</th>
                <th>Payment</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((b) => (
                <tr key={b.billingId}>
                  <td>{b.billingId}</td>
                  <td>{b.customer?.name ?? "—"}</td>
                  <td>{frequencyLabels[b.frequency] ?? b.frequency}</td>
                  <td>{paymentLabels[b.paymentMethod] ?? b.paymentMethod}</td>
                  <td>{new Date(b.billingStartDate).toLocaleDateString("en-US")}</td>
                  <td><span className="badge">{statusLabels[b.status] ?? b.status}</span></td>
                  <td>{new Date(b.createdAt).toLocaleDateString("en-US")}</td>
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
          disabled={billings.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
