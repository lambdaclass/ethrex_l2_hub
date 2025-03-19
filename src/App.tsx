import { useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useChainId } from 'wagmi'
import { ChainSelector } from "./components/ChainSelector";
import { Deposit } from "./components/Deposit";

const App: React.FC = () => {

  const { address, chainId, isConnected } = useAccount()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">EthRex Hub</h1>
        <ChainSelector />
        <ConnectKitButton />
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center">
        {isConnected && (chainId === 9) &&
          <Deposit />}
        {!isConnected &&
          <p className="text-xl text-gray-600">Connect your wallet to get started.</p>
        }
      </main>
    </div>
  );
}

export default App;
