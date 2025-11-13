import { Link } from "react-router-dom";
import { ConnectKitButton } from "connectkit";
import { formatHash } from "../utils/formatting";
import { FaWallet } from "react-icons/fa";

export const Header: React.FC = () => (
  <header className="w-full flex justify-between items-center px-10 py-6">
    {/* Left side - Logo */}
    <div className="flex items-center gap-8">
      <h1 className="text-2xl font-bold text-gray-900">
        <span className="text-indigo-600">Ethrex</span> Hub
      </h1>

      <nav className="flex gap-4">
        <Link
          to="/bridge/withdraw"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Withdraw
        </Link>

        <Link
          to="/bridge/deposit"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Deposit
        </Link>

        {/* <Link
          to="/passkey_demo"
          className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Passkey Demo
        </Link> */}
      </nav>
    </div>

    {/* Right side - Wallet components */}
    <div className="flex items-center gap-4">
      <ConnectKitButton.Custom>
        {({ isConnected, show, address }) => {
          return (
            <button
              onClick={show}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-md"
            >
              {isConnected ? (
                <div className="flex items-center gap-2 justify-between">
                  <FaWallet size="20" />
                  {formatHash(address!)}
                </div>
              ) : (
                "Connect Wallet"
              )}
            </button>
          );
        }}
      </ConnectKitButton.Custom>
    </div>
  </header>
);
