import { type Transaction } from "../components/AccountAbstraction/TransactionHistory";

const MAX_TRANSACTIONS = 100;

export const saveTransaction = (
  address: string,
  transaction: Transaction
): void => {
  try {
    const key = `passkey_transactions_${address}`;
    const stored = localStorage.getItem(key);
    const transactions: Transaction[] = stored ? JSON.parse(stored) : [];

    // Add new transaction at the beginning
    transactions.unshift(transaction);

    // Keep only the latest MAX_TRANSACTIONS
    const trimmed = transactions.slice(0, MAX_TRANSACTIONS);

    localStorage.setItem(key, JSON.stringify(trimmed));
  } catch (err) {
    console.error("Failed to save transaction:", err);
  }
};

export const formatTokenAmount = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toFixed(2);
};
