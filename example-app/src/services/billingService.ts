import type { BillingRow } from '../types/billing';
import { graphql } from './apiHelpers';

/** Billing Service — Manages all API operations related to billings/subscriptions */
class BillingService {
  /** Fetch current user's billings via GraphQL */
  async fetchMyBillings(token: string, skip = 0, take = 20): Promise<BillingRow[]> {
    const data = await graphql<{ myBillings: BillingRow[] }>(
      token,
      `{ myBillings(skip: ${skip}, take: ${take}) { billingId invoiceId invoiceNumber frequency paymentMethod amount status createdAt } }`,
    );
    return data.myBillings ?? [];
  }
}

export const billingService = new BillingService();
export default BillingService;
