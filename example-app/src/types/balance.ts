/** Balance Types — Types for the balance and transaction system */

export interface BalanceInfo {
  balance: number;
  totalCredits: number;
  totalDebits: number;
  transactionCount: number;
}

export interface TransactionRow {
  transactionId: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
}
