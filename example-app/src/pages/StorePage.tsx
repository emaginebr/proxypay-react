import { useState, useEffect } from "react";
import { useNAuth } from "nauth-react";
import {
  fetchMyStore,
  createStore,
  updateStore,
  deleteStore,
  type StoreInfo,
} from "../services/adminApi";

export function StorePage() {
  const { token } = useNAuth();
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [billingStrategy, setBillingStrategy] = useState(1);

  useEffect(() => {
    if (!token) return;
    fetchMyStore(token)
      .then((s) => {
        setStore(s);
        if (s) {
          setName(s.name);
          setEmail(s.email);
          setBillingStrategy(s.billingStrategy);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      if (store) {
        await updateStore(token, {
          storeId: store.storeId,
          name,
          email,
          billingStrategy,
        });
        setSuccess("Loja atualizada com sucesso!");
        const updated = await fetchMyStore(token);
        setStore(updated);
      } else {
        const result = await createStore(token, { name, email, billingStrategy });
        setSuccess(`Loja criada! Client ID: ${result.clientId}`);
        const created = await fetchMyStore(token);
        setStore(created);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !store) return;
    if (!confirm("Tem certeza que deseja excluir a loja?")) return;
    setError("");
    setSaving(true);
    try {
      await deleteStore(token, store.storeId);
      setStore(null);
      setName("");
      setEmail("");
      setBillingStrategy(1);
      setSuccess("Loja excluida com sucesso.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page admin-page"><p>Carregando...</p></div>;

  return (
    <div className="page admin-page">
      <h1>{store ? "Configurar Loja" : "Criar Loja"}</h1>

      {error && <div className="admin-error">{error}</div>}
      {success && <div className="admin-success">{success}</div>}

      {store && (
        <div className="admin-store-badge" style={{ marginBottom: "24px" }}>
          Client ID: <code>{store.clientId}</code>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          <span>Nome da Loja</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Minha Loja"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="loja@email.com"
          />
        </label>
        <label>
          <span>Estrategia de Cobranca</span>
          <select
            value={billingStrategy}
            onChange={(e) => setBillingStrategy(Number(e.target.value))}
          >
            <option value={1}>Imediata</option>
            <option value={2}>Primeiro dia do mes</option>
          </select>
        </label>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Salvando..." : store ? "Atualizar Loja" : "Criar Loja"}
          </button>
          {store && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={saving}
            >
              Excluir Loja
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
