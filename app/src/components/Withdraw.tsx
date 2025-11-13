import { useEffect, useState } from "react";
import { Address, parseEther, PublicClient } from "viem";
import { useAccount, usePublicClient, useSwitchChain, useWaitForTransactionReceipt } from 'wagmi'
import { useWithdraw, useWatchWithdrawalInitiated, useClaimWithdraw } from "../hooks/withdraw";
import { getWithdrawalProof, WithdrawalProof } from "../utils/customRpcMethods";
import { Loading } from "./Loading";

export const Withdraw: React.FC = () => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<string>("");
  const [withdrawnAmount, setWithdrawnAmount] = useState<bigint>(0n);
  const { data, isPending, isSuccess, withdraw } = useWithdraw({ amount: parseEther(amount) })
  const [proof, setProof] = useState<WithdrawalProof | null>(null);
  const { data: dataClaim, isPending: _isPendingCLaim, isSuccess: _isSuccessClaim, claimWithdraw } = useClaimWithdraw({ amount: withdrawnAmount, proof: proof as WithdrawalProof });
  const { data: _dataReceipt, isLoading: _isLoading, isSuccess: isTxReciptSuccess, error: _error } = useWaitForTransactionReceipt({ hash: dataClaim })
  const client = usePublicClient()
  const { switchChain, switchChainAsync } = useSwitchChain()

  useEffect(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) })
  }, [])

  const waitWithdrawalProof = async (client: PublicClient, txHash: Address) => {
    try {
      const receipt = await client.getTransactionReceipt({ hash: txHash });

      // Find the WithdrawalInitiated event log
      const withdrawalLog = receipt.logs.find(log =>
        log.address.toLowerCase() === import.meta.env.VITE_L2_BRIDGE_ADDRESS.toLowerCase()
      );

      if (withdrawalLog && withdrawalLog.topics.length >= 4 && withdrawalLog.topics[3]) {
        // The amount is in topics[3] (indexed parameter)
        const amountFromLog = BigInt(withdrawalLog.topics[3]);
        setWithdrawnAmount(amountFromLog);
      }

      const proof = await getWithdrawalProof(client, txHash);
      setProof(proof);
    } catch (error) {
      setTimeout(() => waitWithdrawalProof(client, txHash), 5000);
    }
  }

  useWatchWithdrawalInitiated({
    onLogs: (_logs) => {
      if (client && data) {
        waitWithdrawalProof(client, data);
      }
    },
    args: { senderOnL2: address, receiverOnL1: address }
  })


  const claimWithdrawClick = async () => {
    try {
      await switchChainAsync({ chainId: Number(import.meta.env.VITE_L1_CHAIN_ID) });
      claimWithdraw();
    } catch (error) {
      console.error("Error claiming withdrawal:", error);
    }
  }

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
          {isPending ? "Waiting for wallet confirmation..." : "Start withdrawal Process"}
        </button>
        {isSuccess &&
          <>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h3 className="text-lg font-semibold text-green-800">Transaction Successful!</h3>
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
              {proof ? "Claim Withdrawal" : <><Loading /> Waiting for claming to be ready</>}
            </button>
            {isTxReciptSuccess &&
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <h3 className="text-lg font-semibold text-green-800">Claim ready!</h3>
                <p className="text-sm text-green-700 mt-2">
                  Transaction Hash:{" "}
                  <span className="font-mono break-all">{dataClaim}</span>
                </p>
              </div>}
          </>
        }
      </div>
    </div>
  )
}
