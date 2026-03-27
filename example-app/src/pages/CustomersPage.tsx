import { useState, useEffect } from "react";
import { useNAuth } from "nauth-react";
import { fetchMyCustomers, type CustomerRow } from "../services/adminApi";

export function CustomersPage() {
  const { token } = useNAuth();
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchMyCustomers(token, page * pageSize, pageSize)
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, page]);

  return (
    <div className="page admin-page">
      <h1>Clientes</h1>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <p>Carregando...</p>
      ) : customers.length === 0 ? (
        <p className="admin-empty">Nenhum cliente encontrado.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Telefone</th>
                <th>Criado em</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.customerId}>
                  <td>{c.customerId}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.documentId}</td>
                  <td>{c.cellphone}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString("pt-BR")}</td>
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
          disabled={customers.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Proxima
        </button>
      </div>
    </div>
  );
}
