import React, { useEffect, useState } from "react";
import { SuccessData } from "../Modal";
import { formatHash } from "../../../utils/formatting";
import { formatEther } from "viem";
import { Spinner } from "../../Spinner";
import { useClaimProof, useClaimWithdraw2 } from "../../../hooks/withdraw";

export type SuccessProps = {
  closeModal: () => void;
  data: SuccessData;
};

export const Success: React.FC<SuccessProps> = ({
  closeModal,
  data,
}: SuccessProps) => {
  const { claimWithdraw } = useClaimWithdraw2();
  const { proof, isLoading: proofIsLoading } = useClaimProof(
    data.receipt.transactionHash,
  );
  const [claimed, setClaimed] = useState<boolean>(false);
  const [claimStatus, setClaimStatus] = useState<string | undefined>();

  useEffect(() => {
    console.log("Proof loading:", proofIsLoading);
    console.log("Proof:", proof);
    console.log("Claimed:", claimed);
    console.log("Claim Status:", claimStatus);
  }, [proof, proofIsLoading, claimed, claimStatus]);

  const onClick = async () => {
    if (!proof || !claimWithdraw) return;

    try {
      await claimWithdraw(data.amount, proof);
      setClaimStatus("Funds claimed successfully!");
      setClaimed(true);
    } catch (_error) {
      setClaimStatus("Unable to claim funds. Please try again later.");
    }
  };

  const disableClaimButton = claimed || proofIsLoading;

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
            <span className="text-gray-600 text-sm">Tx Hash</span>
            <a href="#" className="text-indigo-600 hover:underline text-sm">
              {formatHash(data.receipt.transactionHash)}
            </a>
          </div>
        </div>

        <div className="mt-8 w-full flex flex-col gap-3">
          <button
            className="main-button"
            disabled={disableClaimButton}
            onClick={onClick}
          >
            <Spinner className="w-5 h-5" />
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
