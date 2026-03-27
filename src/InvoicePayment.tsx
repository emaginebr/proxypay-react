import { useState, useCallback } from "react";
import { useProxyPay } from "./ProxyPayProvider";
import { PaymentMethod } from "./types";
import type { InvoicePaymentProps } from "./types";

export function InvoicePayment({
  customer,
  items,
  paymentMethod = PaymentMethod.CreditCard,
  completionUrl,
  returnUrl,
  notes,
  discount,
  dueDate,
  onError,
  children,
}: InvoicePaymentProps) {
  const { createInvoice } = useProxyPay();
  const [loading, setLoading] = useState(false);

  const handleClick = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await createInvoice(customer, items, {
        paymentMethod,
        completionUrl,
        returnUrl,
        notes,
        discount,
        dueDate,
      });
      window.location.href = response.url;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      onError?.(error);
      setLoading(false);
    }
  }, [
    loading,
    createInvoice,
    customer,
    items,
    paymentMethod,
    completionUrl,
    returnUrl,
    notes,
    discount,
    dueDate,
    onError,
  ]);

  return (
    <div onClick={handleClick} style={{ display: "inline-block", cursor: loading ? "wait" : "pointer" }}>
      {children}
    </div>
  );
}
