/** Billing Types — Types for the billing/subscription system */

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
