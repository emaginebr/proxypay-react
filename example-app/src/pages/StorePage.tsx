import { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";

export function StorePage() {
  const { store, loading, error, createStore, updateStore, deleteStore } = useStore();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [billingStrategy, setBillingStrategy] = useState(1);

  useEffect(() => {
    if (store) {
      setName(store.name);
      setEmail(store.email);
      setBillingStrategy(store.billingStrategy);
    }
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");
    setSuccess("");
    setSaving(true);

    try {
      if (store) {
        await updateStore({
          storeId: store.storeId,
          name,
          email,
          billingStrategy,
        });
        setSuccess("Loja atualizada com sucesso!");
      } else {
        const result = await createStore({ name, email, billingStrategy });
        setSuccess(`Loja criada! Client ID: ${result.clientId}`);
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!store) return;
    if (!confirm("Tem certeza que deseja excluir a loja?")) return;
    setLocalError("");
    setSaving(true);
    try {
      await deleteStore(store.storeId);
      setName("");
      setEmail("");
      setBillingStrategy(1);
      setSuccess("Loja excluida com sucesso.");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Erro ao excluir");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page admin-page"><p>Carregando...</p></div>;

  const displayError = localError || error;

  return (
    <div className="page admin-page">
      <h1>{store ? "Configurar Loja" : "Criar Loja"}</h1>

      {displayError && <div className="admin-error">{displayError}</div>}
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
