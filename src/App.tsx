import { useState } from "react";
import { ConnectKitButton } from "connectkit";

function App() {
  interface TransactionReceipt {
    transactionHash: string;
    status: string;
    amount: string;
  }

  const [transactionReceipt, setTransactionReceipt] = useState<TransactionReceipt | null>(null);
  const [isBridging, setIsBridging] = useState(false);

  // Simulate bridging transaction (replace with actual Web3 logic)
  const handleBridge = () => {
    setIsBridging(true);
    // Simulate a transaction (e.g., using a setTimeout)
    setTimeout(() => {
      const receipt = {
        transactionHash: "0x123...abc",
        status: "success",
        amount: "1.5 ETH",
      };
      setTransactionReceipt(receipt);
      setIsBridging(false);
    }, 3000); // Simulate a 3-second delay
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">EthRex Hub</h1>
        <ConnectKitButton />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Bridge Ethers</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter amount in Ether"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleBridge}
              disabled={isBridging}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-blue-300"
            >
              {isBridging ? "Bridging..." : "Bridge"}
            </button>
          </div>

          {/* Confirmation Box */}
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
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
