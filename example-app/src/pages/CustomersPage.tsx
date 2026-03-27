import { useState, useEffect } from "react";
import { useCustomer } from "../hooks/useCustomer";
import { SkeletonTable } from "../components/Skeleton";

export function CustomersPage() {
  const { customers, loading, error, loadCustomers } = useCustomer();
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    loadCustomers(page * pageSize, pageSize);
  }, [loadCustomers, page]);

  return (
    <div className="page admin-page">
      <h1>Customers</h1>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <SkeletonTable rows={5} cols={6} />
      ) : customers.length === 0 ? (
        <p className="admin-empty">No customers found.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Document ID</th>
                <th>Phone</th>
                <th>Created</th>
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
                  <td>{new Date(c.createdAt).toLocaleDateString("en-US")}</td>
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
          disabled={customers.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
