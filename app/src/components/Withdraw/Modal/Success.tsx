import React, { useState } from "react";
import { SuccessData } from "../Modal";
import { formatHash } from "../../../utils/formatting";
import { formatEther } from "viem";
import { Spinner } from "../../Spinner";
import { useClaimProof, useClaimWithdraw } from "../../../hooks/withdraw";
import { updateClaimStatus } from "../../../utils/claims";

export type SuccessProps = {
  closeModal: () => void;
  data: SuccessData;
};

export const Success: React.FC<SuccessProps> = ({
  closeModal,
  data,
}: SuccessProps) => {
  const { claimWithdraw } = useClaimWithdraw();
  const { proof, isLoading: proofIsLoading } = useClaimProof(
    data.receipt.transactionHash,
  );
  const [claimed, setClaimed] = useState<boolean>(false);
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimStatus, setClaimStatus] = useState<string | undefined>();

  const onClick = async () => {
    if (!proof || !claimWithdraw) return;

    setIsClaiming(true);
    setClaimStatus("Claiming funds...");

    try {
      await claimWithdraw(data.amount, proof);
      updateClaimStatus(data.receipt.transactionHash, true);

      setClaimStatus("Funds claimed successfully!");
      setClaimed(true);
    } catch (error) {
      console.log(error);
      setClaimStatus("Unable to claim funds. Please try again later.");
    } finally {
      setIsClaiming(false);
    }
  };

  const disableClaimButton = claimed || isClaiming || proofIsLoading;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="glass rounded-3xl p-8 w-full max-w-md shadow-xl text-center relative">
        <h3 className="text-2xl font-semibold text-gray-900">
          Withdrawal Successful!
        </h3>

        <p className="text-gray-600 mt-2 mb-6">
          Your funds have been successfully bridged to Ethereum Mainnet.
        </p>

        <div className="bg-white/70 rounded-xl p-4 text-left space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Amount</span>
            <span className="text-gray-900 font-medium">
              {formatEther(data.amount)} ETH
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">From</span>
            <a
              href={`http://localhost:8082/address/${data.receipt.from}`}
              target="_blank"
              className="text-indigo-600 hover:underline text-sm"
            >
              {formatHash(data.receipt.from)}
            </a>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">To</span>
            <a
              href={`http://localhost:8082/address/${data.receipt.to}`}
              target="_blank"
              className="text-indigo-600 hover:underline text-sm"
            >
              {formatHash(data.receipt.to)}
            </a>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 text-sm">Tx Hash</span>
            <a
              href={`http://localhost:8082/tx/${data.receipt.transactionHash}`}
              target="_blank"
              className="text-indigo-600 hover:underline text-sm"
            >
              {formatHash(data.receipt.transactionHash)}
            </a>
          </div>
        </div>

        <div className="mt-8 w-full flex flex-col gap-3">
          <button
            className="main-button truncate"
            disabled={disableClaimButton}
            onClick={onClick}
          >
            {proofIsLoading || isClaiming ? (
              <Spinner className="w-5 h-5" />
            ) : null}
            {claimStatus || "Claim Funds"}
          </button>
          <button className="secondary-button" onClick={closeModal}>
            Close
          </button>
        </div>

        <div className="absolute -z-10 inset-0 rounded-3xl bg-gradient-to-br from-green-100/40 to-indigo-100/40"></div>
      </div>
    </div>
  );
};
