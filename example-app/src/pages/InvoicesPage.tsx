import { useState, useEffect } from "react";
import { useInvoice } from "../hooks/useInvoice";

const statusColors: Record<string, string> = {
  Pending: "badge-warning",
  Sent: "badge-info",
  Paid: "badge-success",
  Overdue: "badge-danger",
  Cancelled: "badge-muted",
  Expired: "badge-muted",
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
      <h1>Faturas</h1>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <p>Carregando...</p>
      ) : invoices.length === 0 ? (
        <p className="admin-empty">Nenhuma fatura encontrada.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Numero</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Criada em</th>
                <th>Paga em</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoiceId}>
                  <td>{inv.invoiceId}</td>
                  <td><code>{inv.invoiceNumber}</code></td>
                  <td>R$ {inv.amount.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${statusColors[inv.statusText] ?? ""}`}>
                      {inv.statusText}
                    </span>
                  </td>
                  <td>{new Date(inv.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td>{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString("pt-BR") : "—"}</td>
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
          Anterior
        </button>
        <span>Pagina {page + 1}</span>
        <button
          className="btn btn-secondary"
          disabled={invoices.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Proxima
        </button>
      </div>
    </div>
  );
}
