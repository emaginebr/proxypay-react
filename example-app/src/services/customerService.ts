import type { CustomerRow } from '../types/customer';
import { graphql } from './apiHelpers';

/** Customer Service — Manages all API operations related to customers */
class CustomerService {
  /** Fetch current user's customers via GraphQL */
  async fetchMyCustomers(token: string, skip = 0, take = 20): Promise<CustomerRow[]> {
    const data = await graphql<{ myCustomers: CustomerRow[] }>(
      token,
      `{ myCustomers(skip: ${skip}, take: ${take}) { customerId name email documentId cellphone createdAt } }`,
    );
    return data.myCustomers ?? [];
  }
}

export const customerService = new CustomerService();
export default CustomerService;
