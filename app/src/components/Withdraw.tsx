import { useState } from "react";
import { parseEther } from "viem";
import { useAccount } from 'wagmi'
import { useWithdraw, useWatchWithdrawalInitiated } from "../hooks/withdraw";

export const Withdraw: React.FC = () => {
  const { address } = useAccount()
  const [amount, setAmount] = useState<string>("");
  const { data, isPending, isSuccess, withdraw } = useWithdraw({ amount: parseEther(amount) })

  useWatchWithdrawalInitiated({
    onLogs: (logs) => {
      console.log(logs)
    },
    args: { senderOnL2: address, receiverOnL1: address }
  })

  // Simulate bridging transaction (replace with actual Web3 logic)

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
          disabled={isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {isPending ? "Waiting for wallet confirmation..." : "Start withdrawal Process"}
        </button>
        {isSuccess &&
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-semibold text-green-800">Transaction Successful!</h3>
            <p className="text-sm text-green-700 mt-2">
              Transaction Hash:{" "}
              <span className="font-mono break-all">{data}</span>
            </p>
          </div>}
      </div>
    </div>
  )
}
