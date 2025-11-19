import { useState } from "react";
import { mintToken, TOKENS_TO_WEI } from "../../utils/token";
import { type Address, type TransactionReceipt } from "viem";
import { client } from "../../config/passkey_config";
import { formatHash } from "../../utils/formatting";
import { saveTransaction, formatTokenAmount } from "../../utils/transactionHistory";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: Address;
  credentialId: string;
  onMintSuccess?: () => void;
}

export default function MintModal({
  isOpen,
  onClose,
  address,
  credentialId,
  onMintSuccess,
}: MintModalProps) {
  const [mintValue, setMintValue] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);

  if (!isOpen) return null;

  const handleMint = async () => {
    const value = parseFloat(mintValue);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const txReceipt = await mintToken(client, address, BigInt(value) * TOKENS_TO_WEI, credentialId);
      setReceipt(txReceipt);

      if (txReceipt.status === "success") {
        saveTransaction(address, {
          hash: txReceipt.transactionHash,
          method: "mint",
          timestamp: Date.now(),
          from: address,
          to: address,
          amount: formatTokenAmount(value),
          blockNumber: Number(txReceipt.blockNumber),
        });

        if (onMintSuccess) {
          onMintSuccess();
          setTimeout(handleClose, 2000);
        }
      }
    } catch (err) {
      setError("Failed to mint tokens. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setReceipt(null);
    setMintValue("10");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-md shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
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
                  d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Mint Tokens</h2>
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

        <p className="text-sm text-gray-600 mb-6">Mint tokens to your account</p>

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
            <label className="block text-gray-700 text-sm mb-2">Amount</label>
            <input
              type="number"
              value={mintValue}
              onChange={(e) => setMintValue(e.target.value)}
              placeholder="0.00"
              disabled={loading}
              min="0"
              step="0.01"
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 bg-white"
            />
          </div>

          <button
            onClick={handleMint}
            disabled={loading}
            className="main-button w-full flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-5 h-5">
                <div className="spinner w-5 h-5"></div>
              </div>
            )}
            {loading ? "Minting..." : "Mint Tokens"}
          </button>
        </div>

        {/* Success Message */}
        {!loading && receipt?.status === "success" && (
          <div className="p-4 bg-green-100 border border-green-400 rounded-xl mt-4">
            <div className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Tokens minted successfully!
                </h3>
                <p className="text-sm text-green-700">
                  Transaction Hash: {formatHash(receipt.transactionHash)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
