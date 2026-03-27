import type { BalanceInfo } from '../types/balance';
import type { TransactionRow } from '../types/balance';
import { graphql } from './apiHelpers';

/** Balance Service — Manages all API operations related to balance and transactions */
class BalanceService {
  /** Fetch current user's balance via GraphQL */
  async fetchMyBalance(token: string): Promise<BalanceInfo> {
    const data = await graphql<{ myBalance: BalanceInfo[] }>(
      token,
      `{ myBalance { balance totalCredits totalDebits transactionCount } }`,
    );
    return data.myBalance?.[0] ?? { balance: 0, totalCredits: 0, totalDebits: 0, transactionCount: 0 };
  }

  /** Fetch current user's transactions via GraphQL */
  async fetchMyTransactions(token: string, skip = 0, take = 20): Promise<TransactionRow[]> {
    const data = await graphql<{ myTransactions: TransactionRow[] }>(
      token,
      `{ myTransactions(skip: ${skip}, take: ${take}) { transactionId type amount description createdAt } }`,
    );
    return data.myTransactions ?? [];
  }
}

export const balanceService = new BalanceService();
export default BalanceService;
