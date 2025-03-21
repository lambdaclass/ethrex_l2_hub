import { useState, useEffect } from "react";
import { parseEther } from "viem";
import { useWaitForTransactionReceipt } from "wagmi";
import { useDeposit } from "../hooks/deposit";

export const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const { data, isPending, isSuccess: isTxSuccess, deposit } = useDeposit({ amount: parseEther(amount) })
  const { isLoading, isSuccess: isTxReciptSuccess } = useWaitForTransactionReceipt({ hash: data })

  useEffect(() => {
    if (isTxReciptSuccess)
      setAmount("")
  }, [isTxReciptSuccess])

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
              <p className="text-sm text-gray-700 mt-2">The deposit has been confirmed!</p>}
          </div>}


        {/* Confirmation Box 
            {transactionReceipt && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="text-lg font-semibold text-green-800">Transaction Successful!</h3>
                    <p className="text-sm text-green-700 mt-2">
                        Transaction Hash:{" "}
                        <span className="font-mono break-all">{transactionReceipt.transactionHash}</span>
                    </p>
                    <p className="text-sm text-green-700">
                        Amount Bridged:{" "}
                        <span className="font-mono">{transactionReceipt.amount}</span>
                    </p>
                    <p className="text-sm text-green-700">
                        Status:{" "}
                        <span className="font-mono">{transactionReceipt.status}</span>
                    </p>
                </div>
            )}*/}
      </div>
    </div>
  )
}
