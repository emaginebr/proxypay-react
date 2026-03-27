import { useState, useEffect } from "react";
import { useStore } from "../hooks/useStore";
import { Skeleton, SkeletonForm } from "../components/Skeleton";

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
        setSuccess("Store updated successfully!");
      } else {
        const result = await createStore({ name, email, billingStrategy });
        setSuccess(`Store created! Client ID: ${result.clientId}`);
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!store) return;
    if (!confirm("Are you sure you want to delete this store?")) return;
    setLocalError("");
    setSaving(true);
    try {
      await deleteStore(store.storeId);
      setName("");
      setEmail("");
      setBillingStrategy(1);
      setSuccess("Store deleted successfully.");
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Error deleting");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="page admin-page">
      <Skeleton width="200px" height="28px" style={{ marginBottom: "24px" }} />
      <SkeletonForm />
    </div>
  );

  const displayError = localError || error;

  return (
    <div className="page admin-page">
      <h1>{store ? "Configure Store" : "Create Store"}</h1>

      {displayError && <div className="admin-error">{displayError}</div>}
      {success && <div className="admin-success">{success}</div>}

      {store && (
        <div className="admin-store-badge" style={{ marginBottom: "24px" }}>
          Client ID: <code>{store.clientId}</code>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          <span>Store Name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="My Store"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="store@email.com"
          />
        </label>
        <label>
          <span>Billing Strategy</span>
          <select
            value={billingStrategy}
            onChange={(e) => setBillingStrategy(Number(e.target.value))}
          >
            <option value={1}>Immediate</option>
            <option value={2}>First day of month</option>
          </select>
        </label>

        <div className="admin-form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : store ? "Update Store" : "Create Store"}
          </button>
          {store && (
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={saving}
            >
              Delete Store
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
