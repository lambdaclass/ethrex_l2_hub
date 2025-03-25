import { Link } from "react-router-dom"
import { ChainSelector } from "./ChainSelector"
import { ConnectKitButton } from "connectkit"

export const Header: React.FC = () =>
  <header className="bg-white shadow p-4 flex justify-between items-center">
    {/* Left side - Logo */}
    <div className="flex items-center space-x-8">
      <h1 className="text-2xl font-bold text-gray-800">EthRex Hub</h1>
      <nav className="flex space-x-4">
        <Link
          to="/bridge"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Bridge
        </Link>
        <Link
          to="/passkey_demo"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Passkey Demo
        </Link>
      </nav>
    </div>
    {/* Right side - Wallet components */}
    <div className="flex items-center space-x-4">
      <ChainSelector />
      <ConnectKitButton />
    </div>
  </header>
