import { useState } from "react";
import { parseEther } from "viem";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";

const bridgeAddress = "0x39053c40f68e58b089408c398dd8441a71a644c7"

export const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const { data, isPending, isSuccess: isTxSuccess, sendTransaction } = useSendTransaction()
  const { data: txReceiptData, isLoading, isSuccess: isTxReciptSuccess, isFetched, isError, isPaused } = useWaitForTransactionReceipt({ hash: data })

  // Simulate bridging transaction (replace with actual Web3 logic)
  const handleDeposit = () => {
    sendTransaction({
      to: bridgeAddress,
      value: parseEther(amount),
    })
  };

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
          onClick={handleDeposit}
          disabled={isPending}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {isPending ? "Waiting for wallet confirmation..." : "Deposit"}
        </button>
        {isTxSuccess &&
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <h3 className="text-lg font-semibold text-green-800">The Deposit Process has started!</h3>
            <p className="text-sm text-green-700 mt-2">
              Transaction Hash:{" "}
              <span className="font-mono break-all">{data}</span>
            </p>
            {isLoading &&
              <p className="text-sm text-gray-700 mt-2">Waiting for confirmation...</p>}
            {isTxReciptSuccess &&
              <>
                <p className="text-sm text-green-700 mt-2">The deposit has been confirmed!</p>
                <p className="text-sm text-green-700 mt-2">{txReceiptData.blockHash}</p>
              </>}
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
