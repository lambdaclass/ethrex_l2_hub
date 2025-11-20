import { useState, useEffect } from "react";
import { parseEther, type Log } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { useDeposit, useWatchDepositInitiated } from "../../hooks/deposit";

export const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  useAccount();
  const { deposit, step, txHash } = useDeposit();
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_L1_CHAIN_ID) })
  }, [])

  useEffect(() => {
    if (step === "done")
      setAmount("")
  }, [step])

  useWatchDepositInitiated({
    onLogs: (logs: Log[]) => {
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
          onClick={() => deposit && deposit(parseEther(amount))}
          disabled={!deposit || step === "signing" || step === "waiting_signature_receipt"}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
        >
          {step === "signing" ? "Waiting for wallet confirmation..." : "Deposit"}
        </button>
        {txHash &&
          <div className={`p-4 ${step === "done" ? "bg-green-300" : "bg-violet-200"} rounded-md`}>
            <h3 className="text-lg font-semibold text-gray-800">The Deposit Process has {step === "done" ? "Finished" : "started"}</h3>
            <p className="text-sm text-gray-700 mt-2">
              Transaction Hash:{" "}
              <span className="font-mono break-all">{txHash}</span>
            </p>
            {step === "waiting_signature_receipt" &&
              <p className="text-sm text-gray-500 mt-2">Waiting for confirmation...</p>}
            {step === "done" &&
              <p className="text-sm text-gray-700 mt-2">The deposit has been sent!</p>}
          </div>}
      </div>
    </div>
  )
}
