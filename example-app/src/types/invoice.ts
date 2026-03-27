/** Invoice Types — Types for the invoice system */

export interface InvoiceRow {
  invoiceId: number;
  invoiceNumber: string;
  amount: number;
  status: number;
  statusText: string;
  createdAt: string;
  paidAt: string | null;
}
