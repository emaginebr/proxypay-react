import { useState, useEffect } from "react";
import { useNAuth } from "nauth-react";
import { fetchMyBillings, type BillingRow } from "../services/adminApi";

const frequencyLabels: Record<number, string> = {
  1: "Mensal",
  2: "Trimestral",
  3: "Semestral",
  4: "Anual",
};

const paymentLabels: Record<number, string> = {
  1: "PIX",
  2: "Boleto",
  3: "Cartao Credito",
  4: "Cartao Debito",
};

export function BillingsPage() {
  const { token } = useNAuth();
  const [billings, setBillings] = useState<BillingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchMyBillings(token, page * pageSize, pageSize)
      .then(setBillings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, page]);

  return (
    <div className="page admin-page">
      <h1>Assinaturas</h1>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <p>Carregando...</p>
      ) : billings.length === 0 ? (
        <p className="admin-empty">Nenhuma assinatura encontrada.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fatura</th>
                <th>Valor</th>
                <th>Frequencia</th>
                <th>Pagamento</th>
                <th>Status</th>
                <th>Criada em</th>
              </tr>
            </thead>
            <tbody>
              {billings.map((b) => (
                <tr key={b.billingId}>
                  <td>{b.billingId}</td>
                  <td><code>{b.invoiceNumber}</code></td>
                  <td>R$ {b.amount.toFixed(2)}</td>
                  <td>{frequencyLabels[b.frequency] ?? b.frequency}</td>
                  <td>{paymentLabels[b.paymentMethod] ?? b.paymentMethod}</td>
                  <td><span className="badge">{b.status}</span></td>
                  <td>{new Date(b.createdAt).toLocaleDateString("pt-BR")}</td>
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
          disabled={billings.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Proxima
        </button>
      </div>
    </div>
  );
}
