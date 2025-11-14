import React from "react";
import { formatEther } from "viem";
import { formatHash } from "../../utils/formatting";

export type SuccessData = {
  submissionTxHash: `0x${string}`;
  amount: bigint;
  receipt: {
    from: `0x${string}` | null;
    to: `0x${string}` | null;
  };
};

export type SuccessProps = {
  closeModal: () => void;
  successData: SuccessData;
};

export const Success: React.FC<SuccessProps> = ({
  closeModal,
  successData,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="glass rounded-3xl p-8 w-full max-w-md shadow-xl text-center relative">
        <h3 className="text-2xl font-semibold text-gray-900">
          Deposit Successful!
        </h3>
        <p className="text-gray-600 mt-2 mb-6">
          Your funds have been successfully bridged to Ethrex L2.
        </p>

        <div className="bg-white/70 rounded-xl p-4 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Amount</span>
            <span className="text-gray-900 font-medium">
              {formatEther(successData.amount)} ETH
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">From</span>
            <a
              href={`https://etherscan.io/address/${successData.receipt.from}`}
              target="_blank"
              className="text-indigo-600 hover:underline text-sm"
            >
              {formatHash(successData.receipt.from)}
            </a>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">To</span>
            <a
              href={`https://etherscan.io/address/${successData.receipt.to}`}
              target="_blank"
              className="text-indigo-600 hover:underline text-sm"
            >
              {formatHash(successData.receipt.to)}
            </a>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Tx Hash</span>
            <a
              href={`https://etherscan.io/tx/${successData.submissionTxHash}`}
              target="_blank"
              className="text-indigo-600 hover:underline text-sm"
            >
              {formatHash(successData.submissionTxHash)}
            </a>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={closeModal}
            className="hover:cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-md"
          >
            Close
          </button>
        </div>

        <div className="absolute -z-10 inset-0 rounded-3xl bg-gradient-to-br from-green-100/40 to-indigo-100/40"></div>
      </div>
    </div>
  );
};
