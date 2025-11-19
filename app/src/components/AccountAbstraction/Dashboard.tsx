import { useState, useEffect, useImperativeHandle, forwardRef, useRef } from "react";
import { type Address, formatEther } from "viem";
import { getTokenBalance } from "../../utils/token";
import { client } from "../../config/passkey_config";
import TransactionHistory, { type TransactionHistoryRef } from "./TransactionHistory";

interface DashboardProps {
  address: Address;
  username?: string;
  onLogout: () => void;
  onMintClick: () => void;
  onTransferClick: () => void;
}

export interface DashboardRef {
  refreshBalance: () => Promise<void>;
  refreshHistory: () => void;
}

const Dashboard = forwardRef<DashboardRef, DashboardProps>(
  (
    { address, username, onLogout, onMintClick, onTransferClick },
    ref
  ) => {
    const [balance, setBalance] = useState<bigint | undefined>();
    const [copied, setCopied] = useState(false);
    const transactionHistoryRef = useRef<TransactionHistoryRef>(null);

    useEffect(() => {
      updateBalance();
    }, [address]);

    const updateBalance = async () => {
      try {
        const tokens = await getTokenBalance(client, address);
        setBalance(tokens);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    };

    // Expose refreshBalance and refreshHistory methods to parent component
    useImperativeHandle(ref, () => ({
      refreshBalance: updateBalance,
      refreshHistory: () => transactionHistoryRef.current?.refreshHistory(),
    }));

    const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const getShortAddress = (addr: string) => {
      return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const getInitial = () => {
      return username ? username.charAt(0).toUpperCase() : "A";
    };

    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-700 mt-1">Manage your account and tokens</p>
            </div>
            <button
              onClick={onLogout}
              className="secondary-button flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>

          {/* Main Card */}
          <div className="glass rounded-3xl shadow-lg p-8 mb-6">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {getInitial()}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">
                  {username || "Anonymous"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-700 font-mono text-sm">
                    {getShortAddress(address)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(address)}
                    className="p-1 hover:bg-white hover:bg-opacity-30 rounded transition-all"
                    title="Copy address"
                  >
                    {copied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Balance */}
            <div className="bg-white bg-opacity-40 rounded-xl p-6 mb-6 border border-white border-opacity-50">
              <div className="flex items-center gap-2 text-indigo-700 mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                <span className="font-medium">Total Balance</span>
              </div>
              <div className="text-5xl font-bold text-gray-900 mb-1">
                {balance ? Number(formatEther(balance)).toFixed(2) : "0.00"}
              </div>
              <div className="text-gray-700">Tokens</div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={onMintClick}
                className="main-button flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Mint Tokens
              </button>
              <button
                onClick={onTransferClick}
                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-xl transition-all shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                Send Tokens
              </button>
            </div>
          </div>

          {/* Transaction History */}
          <TransactionHistory ref={transactionHistoryRef} address={address} />
        </div>
      </div>
    );
  }
);

Dashboard.displayName = "Dashboard";

export default Dashboard;
