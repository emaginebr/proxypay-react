import type { InvoiceRow } from '../types/invoice';
import { graphql } from './apiHelpers';

/** Invoice Service — Manages all API operations related to invoices */
class InvoiceService {
  /** Fetch current user's invoices via GraphQL */
  async fetchMyInvoices(token: string, skip = 0, take = 20): Promise<InvoiceRow[]> {
    const data = await graphql<{ myInvoices: InvoiceRow[] }>(
      token,
      `{ myInvoices(skip: ${skip}, take: ${take}) { invoiceId invoiceNumber amount status statusText createdAt paidAt } }`,
    );
    return data.myInvoices ?? [];
  }
}

export const invoiceService = new InvoiceService();
export default InvoiceService;
