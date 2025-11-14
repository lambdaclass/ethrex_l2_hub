import React from "react";
import { formatHash } from "../../utils/formatting";
import { formatEther } from "viem";

export type FailureData = {
  message: string,
  amount: bigint;
  receipt: {
    transactionHash: `0x${string}`;
  }
};

export type FailureProps = {
  closeModal: () => void;
  failureData: FailureData;
};

export const Failure: React.FC<FailureProps> = ({ closeModal, failureData }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="glass rounded-3xl p-8 w-full max-w-md shadow-xl text-center relative">
        <h3 className="text-2xl font-semibold text-gray-900">
          Deposit Failed
        </h3>

        <p className="text-gray-600 mt-2 mb-6">
          Unfortunately, your deposit could not be completed.
        </p>

        <div className="bg-white/70 rounded-xl p-4 text-left space-y-3">
          <p className="text-gray-600 text-sm text-center">Error message </p>
          <p className="text-red-700 max-h-20 overflow-y-auto break-all p-1 rounded-lg border border-red-300">
            {failureData.message}
          </p>

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Amount</span>
            <span className="text-gray-900 font-medium">
              {formatEther(failureData.amount)} ETH
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Tx Hash</span>
            <a href="#" className="text-indigo-600 hover:underline text-sm">
             {failureData.receipt?.transactionHash
                ? formatHash(failureData.receipt.transactionHash)
                : "-"
              }
            </a>
          </div>
        </div>

        <div className="mt-8 w-full flex flex-col gap-3">
          <button className="main-button" onClick={closeModal}>
            Close
          </button>
        </div>

        <div className="absolute -z-10 inset-0 rounded-3xl bg-gradient-to-br from-red-100/40 to-indigo-50/40"></div>
      </div>
    </div>
  );
};
