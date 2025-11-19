import { useState } from "react";
import { mintToken } from "../../utils/token";
import { type TransactionReceipt, type Address } from "viem";
import { Loading } from "../Loading";
import { client } from "../../config/passkey_config";

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
  const [mintValue, setMintValue] = useState<string>("10");
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleMint = async () => {
    setError("");
    setReceipt(null);

    const value = parseFloat(mintValue);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const _receipt = await mintToken(
        client,
        address,
        BigInt(value) * 1000000000000000000n,
        credentialId
      );
      setLoading(false);
      setReceipt(_receipt);

      if (_receipt.status === "success" && onMintSuccess) {
        setTimeout(() => {
          onMintSuccess();
          handleClose();
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to mint tokens. Please try again.");
      console.error(err);
    }
  };

  const handleClose = () => {
    setReceipt(null);
    setError("");
    setMintValue("10");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Mint Tokens</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (ETRX)
            </label>
            <input
              type="number"
              value={mintValue}
              onChange={(e) => setMintValue(e.target.value)}
              placeholder="Enter amount"
              className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              disabled={loading}
              min="0"
              step="0.01"
            />
          </div>

          <button
            onClick={handleMint}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loading ? "Minting..." : "Mint Tokens"}
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
          <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Tokens minted successfully!
            </h3>
            <p className="text-sm text-green-700">
              Transaction Hash:{" "}
              <span className="font-mono break-all text-xs">
                {receipt.transactionHash}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
