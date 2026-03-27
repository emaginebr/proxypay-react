import { useState, useEffect } from "react";
import { useCustomer } from "../hooks/useCustomer";

export function CustomersPage() {
  const { customers, loading, error, loadCustomers } = useCustomer();
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadCustomers(page * pageSize, pageSize);
  }, [loadCustomers, page]);

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
