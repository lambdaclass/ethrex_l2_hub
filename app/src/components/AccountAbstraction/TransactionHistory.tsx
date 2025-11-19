import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { type Address } from "viem";
import { formatHash } from "../../utils/formatting";

export interface Transaction {
  hash: string;
  method: "mint" | "transfer";
  timestamp: number;
  from: string;
  to: string;
  amount: string;
}

interface TransactionHistoryProps {
  address: Address;
}

export interface TransactionHistoryRef {
  refreshHistory: () => void;
}

const BLOCKSCOUT_URL = "http://localhost:8082";

const TransactionHistory = forwardRef<TransactionHistoryRef, TransactionHistoryProps>(
  ({ address }, ref) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactions();
  }, [address]);

  const loadTransactions = () => {
    try {
      const key = `passkey_transactions_${address.toLowerCase()}`;
      const stored = localStorage.getItem(key);
      if (stored) {
        const txs = JSON.parse(stored) as Transaction[];
        setTransactions(txs); // Show all transactions
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

  // Expose refreshHistory method to parent component
  useImperativeHandle(ref, () => ({
    refreshHistory: loadTransactions,
  }));

  const getTimeAgo = (timestamp: number): string => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (transactions.length === 0) {
    return (
      <div className="glass rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h3>
        <div className="text-center py-12 text-gray-600">
          <p className="text-lg font-medium">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-8">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">Transaction History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Transaction Hash
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Method
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Age
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                From
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                To
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr
                key={tx.hash + index}
                className="border-b border-gray-200 hover:bg-white/30 transition-colors"
              >
                {/* Transaction Hash */}
                <td className="py-4 px-4">
                  <a
                    href={`${BLOCKSCOUT_URL}/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                  >
                    {formatHash(tx.hash as `0x${string}`)}
                  </a>
                </td>

                {/* Method */}
                <td className="py-4 px-4">
                  {tx.method === "mint" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Mint
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Transfer
                    </span>
                  )}
                </td>

                {/* Age */}
                <td className="py-4 px-4 text-sm text-gray-700">
                  {getTimeAgo(tx.timestamp)}
                </td>

                {/* From */}
                <td className="py-4 px-4">
                  <a
                    href={`${BLOCKSCOUT_URL}/address/${tx.from}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                  >
                    {formatHash(tx.from as `0x${string}`)}
                  </a>
                </td>

                {/* To */}
                <td className="py-4 px-4">
                  <a
                    href={`${BLOCKSCOUT_URL}/address/${tx.to}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
                  >
                    {formatHash(tx.to as `0x${string}`)}
                  </a>
                </td>

                {/* Amount */}
                <td className="py-4 px-4 text-right">
                  <span className="text-sm text-gray-700">
                    {tx.amount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  }
);

TransactionHistory.displayName = "TransactionHistory";

export default TransactionHistory;
