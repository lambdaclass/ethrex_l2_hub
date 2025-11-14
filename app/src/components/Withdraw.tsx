import { useEffect, useState } from "react";
import { Address, parseEther, PublicClient } from "viem";
import {
  useAccount,
  usePublicClient,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  useWithdraw,
  useWatchWithdrawalInitiated,
  useClaimWithdraw,
} from "../hooks/withdraw";
import { getWithdrawalProof, WithdrawalProof } from "../utils/customRpcMethods";
import { Loading } from "./Loading";
import { WithdrawForm } from "../components/Withdraw/Form";
import { Claims } from "./Withdraw/Claims";

export const Withdraw: React.FC = () => {
  const { switchChain } = useSwitchChain();

  useEffect(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) });
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-full mt-8 gap-10 px-4 lg:px-0">
        <WithdrawForm />
        <Claims />
      </div>
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Withdraw Funds</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in Ether"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={withdraw}
          disabled={isPending || isSuccess}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {isPending
            ? "Waiting for wallet confirmation..."
            : "Start withdrawal Process"}
        </button>
        {isSuccess && (
          <>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-semibold text-green-800">
                Transaction Successful!
              </h3>
              <p className="text-sm text-green-700 mt-2">
                Transaction Hash:{" "}
                <span className="font-mono break-all">{data}</span>
              </p>
            </div>

            <button
              onClick={claimWithdrawClick}
              disabled={!proof}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300 items-center text-center"
            >
              {proof ? (
                "Claim Withdrawal"
              ) : (
                <>
                  <Loading /> Waiting for claming to be ready
                </>
              )}
            </button>
            {isTxReciptSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-semibold text-green-800">
                  Claim ready!
                </h3>
                <p className="text-sm text-green-700 mt-2">
                  Transaction Hash:{" "}
                  <span className="font-mono break-all">{dataClaim}</span>
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
