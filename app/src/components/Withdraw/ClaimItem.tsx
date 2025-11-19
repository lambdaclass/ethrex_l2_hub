import { parseEther } from "viem";
import { useClaimProof, useClaimWithdraw } from "../../hooks/withdraw";
import { useEffect, useState } from "react";
import { updateClaimStatus } from "../../utils/claims";
import { formatBalance } from "../../utils/formatting";

type ClaimItemProps = {
  index: number;
  claim: ClaimData;
};

export type ClaimData = {
  address: `0x${string}`;
  transaction_hash: `0x${string}`;
  claimed: boolean;
  amount: string;
};

export const ClaimItem: React.FC<ClaimItemProps> = ({ index, claim }) => {
  const { proof, isLoading: proofIsLoading } = useClaimProof(
    claim.transaction_hash,
  );
  const { claimWithdraw } = useClaimWithdraw();

  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimed, setClaimed] = useState<boolean>(claim.claimed);
  const [claimStatus, setClaimStatus] = useState<string | undefined>();

  useEffect(() => {
    setClaimed(claim.claimed);
  }, [claim]);

  const onClick = async () => {
    if (!proof || !claimWithdraw) return;

    setIsClaiming(true);

    try {
      await claimWithdraw(parseEther(claim.amount), proof);

      updateClaimStatus(claim.transaction_hash, true);

      setClaimed(true);
      setClaimStatus(undefined);
    } catch (error) {
      console.log(error);
      setClaimStatus("Unable to claim funds. Please try again later.");
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/70 border border-gray-200 rounded-2xl p-4">
      <div>
        <p className="text-gray-800 font-medium">Withdrawal #{index + 1}</p>

        <p className="text-sm text-gray-600">
          {formatBalance(parseEther(claim.amount))} ETH
        </p>

        <div className="text-xs text-gray-500 mt-1 space-y-1">
          <p>
            Tx Hash:{" "}
            <a className="text-indigo-600"
              href={`http://localhost:8082/tx/${claim.transaction_hash}`}
              target="_blank">
              {claim.transaction_hash}
            </a>
          </p>

          {claimStatus && <p className="text-red-700 mt-1">{claimStatus}</p>}
        </div>
      </div>

      <div className="mt-4 md:mt-0 flex items-center gap-3">
        {claimed ? (
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-3 py-1">
            Claimed
          </span>
        ) : (
          <>
            {!proofIsLoading && !isClaiming && (
              <span className="text-xs text-green-600 bg-green-100 rounded-full px-3 py-1">
                Ready to Claim
              </span>
            )}

            <button
              onClick={onClick}
              disabled={!proof || proofIsLoading || isClaiming}
              className="main-button !py-1 !px-4"
            >
              {proofIsLoading
                ? "Waiting for proof..."
                : isClaiming
                  ? "Claiming..."
                  : "Claim"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
