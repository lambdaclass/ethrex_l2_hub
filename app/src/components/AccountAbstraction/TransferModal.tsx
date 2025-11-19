import { useState } from "react";
import { transferToken } from "../../utils/token";
import { type Address, type TransactionReceipt } from "viem";
import { Loading } from "../Loading";
import { client } from "../../config/passkey_config";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: Address;
  credentialId: string;
  onTransferSuccess?: () => void;
}

export default function TransferModal({
  isOpen,
  onClose,
  address,
  credentialId,
  onTransferSuccess,
}: TransferModalProps) {
  const [recipient, setRecipient] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleTransfer = async () => {
    setError("");
    setReceipt(null);

    // Validation
    if (!recipient?.startsWith("0x")) {
      setError("Please enter a valid address (must start with 0x)");
      return;
    }

    const amount = parseFloat(value);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const _receipt = await transferToken(
        client,
        address,
        recipient as `0x${string}`,
        BigInt(amount) * 1000000000000000000n,
        credentialId
      );

      setLoading(false);
      setReceipt(_receipt);

      if (_receipt.status === "success" && onTransferSuccess) {
        setTimeout(() => {
          onTransferSuccess();
          handleClose();
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to transfer tokens. Please try again.");
      console.error(err);
    }
  };

  const handleClose = () => {
    setReceipt(null);
    setError("");
    setRecipient("");
    setValue("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-md shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
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
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Send Tokens</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-600 hover:text-gray-800 transition-colors p-1 hover:bg-white/30 rounded-lg"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="text-sm text-gray-600 text-center mb-6">
          <p>Transfer ETRX tokens to another address</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm mb-4">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm mb-2">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              disabled={loading}
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 bg-white font-mono text-sm"
            />
            <div className="text-sm text-gray-600 text-left mt-1">
              Enter the wallet address to send tokens to
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-2">Amount (ETRX)</label>
            <div className="relative">
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0.00"
                disabled={loading}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 bg-white"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                ETRX
              </div>
            </div>
          </div>

          <button
            onClick={handleTransfer}
            disabled={loading}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Tokens"}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-4">
            <Loading />
          </div>
        )}

        {/* Success Message */}
        {!loading && receipt?.status === "success" && (
          <div className="p-4 bg-green-100 border border-green-400 rounded-xl mt-4">
            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Tokens transferred successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Transaction Hash:{" "}
                  <span className="font-mono break-all text-xs">
                    {receipt.transactionHash}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
