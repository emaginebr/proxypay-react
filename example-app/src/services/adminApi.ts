const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TENANT_ID = import.meta.env.VITE_TENANT_ID;

function headers(token: string, json = true): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "X-Tenant-Id": TENANT_ID,
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `API error: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

// --- Store ---

export interface StoreInfo {
  storeId: number;
  clientId: string;
  name: string;
  email: string;
  billingStrategy: number;
  createdAt: string;
  updatedAt: string;
}

export async function createStore(
  token: string,
  data: { name: string; email: string; billingStrategy: number },
): Promise<{ storeId: number; clientId: string }> {
  const res = await fetch(`${API_BASE_URL}/store`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateStore(
  token: string,
  data: { storeId: number; name: string; email: string; billingStrategy: number },
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/store`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteStore(token: string, storeId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/store/${storeId}`, {
    method: "DELETE",
    headers: headers(token, false),
  });
  return handleResponse(res);
}

// --- GraphQL ---

async function graphql<T>(token: string, query: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/graphql`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify({ query }),
  });
  const json = await handleResponse<{ data: T; errors?: { message: string }[] }>(res);
  if (json.errors?.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data;
}

export async function fetchMyStore(token: string): Promise<StoreInfo | null> {
  const data = await graphql<{ myStore: StoreInfo[] }>(
    token,
    `{ myStore { storeId clientId name email billingStrategy createdAt updatedAt } }`,
  );
  return data.myStore?.[0] ?? null;
}

export interface BalanceInfo {
  balance: number;
  totalCredits: number;
  totalDebits: number;
  transactionCount: number;
}

export async function fetchMyBalance(token: string): Promise<BalanceInfo> {
  const data = await graphql<{ myBalance: BalanceInfo[] }>(
    token,
    `{ myBalance { balance totalCredits totalDebits transactionCount } }`,
  );
  return data.myBalance?.[0] ?? { balance: 0, totalCredits: 0, totalDebits: 0, transactionCount: 0 };
}

export interface CustomerRow {
  customerId: number;
  name: string;
  email: string;
  documentId: string;
  cellphone: string;
  createdAt: string;
}

export async function fetchMyCustomers(
  token: string,
  skip = 0,
  take = 20,
): Promise<CustomerRow[]> {
  const data = await graphql<{ myCustomers: CustomerRow[] }>(
    token,
    `{ myCustomers(skip: ${skip}, take: ${take}) { customerId name email documentId cellphone createdAt } }`,
  );
  return data.myCustomers ?? [];
}

export interface InvoiceRow {
  invoiceId: number;
  invoiceNumber: string;
  amount: number;
  status: number;
  statusText: string;
  createdAt: string;
  paidAt: string | null;
}

export async function fetchMyInvoices(
  token: string,
  skip = 0,
  take = 20,
): Promise<InvoiceRow[]> {
  const data = await graphql<{ myInvoices: InvoiceRow[] }>(
    token,
    `{ myInvoices(skip: ${skip}, take: ${take}) { invoiceId invoiceNumber amount status statusText createdAt paidAt } }`,
  );
  return data.myInvoices ?? [];
}

export interface BillingRow {
  billingId: number;
  invoiceId: number;
  invoiceNumber: string;
  frequency: number;
  paymentMethod: number;
  amount: number;
  status: string;
  createdAt: string;
}

export async function fetchMyBillings(
  token: string,
  skip = 0,
  take = 20,
): Promise<BillingRow[]> {
  const data = await graphql<{ myBillings: BillingRow[] }>(
    token,
    `{ myBillings(skip: ${skip}, take: ${take}) { billingId invoiceId invoiceNumber frequency paymentMethod amount status createdAt } }`,
  );
  return data.myBillings ?? [];
}

export interface TransactionRow {
  transactionId: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}

export async function fetchMyTransactions(
  token: string,
  skip = 0,
  take = 20,
): Promise<TransactionRow[]> {
  const data = await graphql<{ myTransactions: TransactionRow[] }>(
    token,
    `{ myTransactions(skip: ${skip}, take: ${take}) { transactionId type amount description createdAt } }`,
  );
  return data.myTransactions ?? [];
}
