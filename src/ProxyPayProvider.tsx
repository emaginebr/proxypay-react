import { createContext, useContext, useMemo } from "react";
import type {
  ProxyPayConfig,
  ProxyPayContextValue,
  CustomerInfo,
  InvoiceItem,
  BillingItem,
  PaymentMethod,
  QRCodeResponse,
  QRCodeStatusResponse,
  InvoiceResponse,
  BillingResponse,
} from "./types";
import type { BillingFrequency } from "./types";

const ProxyPayContext = createContext<ProxyPayContextValue | null>(null);

async function apiRequest<T>(
  baseUrl: string,
  tenantId: string,
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Id": tenantId,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `ProxyPay API error: ${response.status}`);
  }

  return response.json();
}

export function ProxyPayProvider({
  config,
  children,
}: {
  config: ProxyPayConfig;
  children: React.ReactNode;
}) {
  const value = useMemo<ProxyPayContextValue>(
    () => ({
      config,
      createQRCode: (customer: CustomerInfo, items: InvoiceItem[]) =>
        apiRequest<QRCodeResponse>(
          config.baseUrl,
          config.tenantId,
          "/payment/qrcode",
          {
            method: "POST",
            body: JSON.stringify({
              clientId: config.clientId,
              customer,
              items,
            }),
          },
        ),
      checkQRCodeStatus: (invoiceId: number) =>
        apiRequest<QRCodeStatusResponse>(
          config.baseUrl,
          config.tenantId,
          `/payment/qrcode/status/${invoiceId}`,
        ),
      createInvoice: (
        customer: CustomerInfo,
        items: InvoiceItem[],
        options: {
          paymentMethod: PaymentMethod;
          completionUrl: string;
          returnUrl: string;
          notes?: string;
          discount?: number;
          dueDate?: string;
        },
      ) =>
        apiRequest<InvoiceResponse>(
          config.baseUrl,
          config.tenantId,
          "/payment/invoice",
          {
            method: "POST",
            body: JSON.stringify({
              clientId: config.clientId,
              customer,
              items,
              ...options,
            }),
          },
        ),
      createBilling: (
        customer: CustomerInfo,
        items: BillingItem[],
        options: {
          frequency: BillingFrequency;
          paymentMethod: PaymentMethod;
          billingStartDate: string;
          completionUrl: string;
          returnUrl: string;
        },
      ) =>
        apiRequest<BillingResponse>(
          config.baseUrl,
          config.tenantId,
          "/payment/billing",
          {
            method: "POST",
            body: JSON.stringify({
              clientId: config.clientId,
              customer,
              items: items.map((item) => ({
                billingItemId: item.billingItemId ?? 0,
                billingId: item.billingId ?? 0,
                ...item,
              })),
              ...options,
            }),
          },
        ),
    }),
    [config],
  );

  return (
    <ProxyPayContext.Provider value={value}>{children}</ProxyPayContext.Provider>
  );
}

export function useProxyPay(): ProxyPayContextValue {
  const context = useContext(ProxyPayContext);
  if (!context) {
    throw new Error("useProxyPay must be used within a <ProxyPayProvider>");
  }
  return context;
}
