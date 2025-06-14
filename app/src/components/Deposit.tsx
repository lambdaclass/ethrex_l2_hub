import { useState, useEffect } from "react";
import { parseEther } from "viem";
import { useAccount, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { useDeposit, useWatchDepositInitiated } from "../hooks/deposit";

export const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const { address } = useAccount();
  const { data, isPending, isSuccess: isTxSuccess, deposit } = useDeposit({ amount: parseEther(amount) })
  const { isLoading, isSuccess: isTxReciptSuccess } = useWaitForTransactionReceipt({ hash: data })

  const { switchChain } = useSwitchChain()

  useEffect(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_L1_CHAIN_ID) })
  }, [])

  useEffect(() => {
    if (isTxReciptSuccess)
      setAmount("")
  }, [isTxReciptSuccess])

  useWatchDepositInitiated({
    onLogs: (logs) => {
      console.log(logs)
    }
  })

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4 text-center">Deposit Funds</h2>
      <div className="space-y-4">
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in Ether"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={deposit}
          disabled={isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {isPending ? "Waiting for wallet confirmation..." : "Deposit"}
        </button>
        {isTxSuccess &&
          <div className={`p-4 ${isTxReciptSuccess ? "bg-green-300" : "bg-violet-200"} rounded-md`}>
            <h3 className="text-lg font-semibold text-gray-800">The Deposit Process has {isTxReciptSuccess ? "Finished" : "started"}</h3>
            <p className="text-sm text-gray-700 mt-2">
              Transaction Hash:{" "}
              <span className="font-mono break-all">{data}</span>
            </p>
            {isLoading &&
              <p className="text-sm text-gray-500 mt-2">Waiting for confirmation...</p>}
            {isTxReciptSuccess &&
              <p className="text-sm text-gray-700 mt-2">The deposit has been sent!</p>}
            {

            }
          </div>}
      </div>
    </div>
  )
}
