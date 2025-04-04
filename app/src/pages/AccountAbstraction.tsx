import { useEffect, useState } from "react";
import { useSwitchChain } from "wagmi";
import { client } from "../config/passkey_config";
import { signUp, login } from "../utils/passkeyAccounts";
import { Address, TransactionReceipt } from "viem";
import { CreateCredentialReturnType } from "webauthn-p256";
import MintCard from "../components/AccountAbstraction/MintCard";
import TransferCard from "../components/AccountAbstraction/TransferCard";

export const AccountAbstraction: React.FC = () => {
  const [username, setUsername] = useState<string>("");

  const [address, setAddress] = useState<Address | null>(null);
  const [credential, setCredential] =
    useState<CreateCredentialReturnType | null>(null);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);

  const { switchChain } = useSwitchChain();
  useEffect(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) });
  }, []);

  const handleSignUp = async () => {
    const { address, credential, receipt } = await signUp({ client, username });
    setAddress(address);
    setCredential(credential);
    setReceipt(receipt);
  };

  const handleLogin = async () => {
    const { address, credential } = await login({ client });
    setAddress(address);
    setCredential(credential);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
      <h2 className="text-xl font-semibold mb-4 text-center">Passkey Demo</h2>
      <p className="text-lg text-gray-800">
        This page demonstrates the use of the Account Abstraction feature on
        Ethrex.
      </p>
      <br />
      <div className="example">
        <div className="flex items-center justify-between">
          <p className="text-lg text-gray-800">
            <span className="font-bold text-2xl text-blue-600">1</span>. Create
            a passkey account or Login
          </p>
        </div>

        <hr className="border-gray-300 my-4" />

        <div className="space-y-4 mt-4 max-w-full">
          <div className="flex gap-6">
            {/* Left side - Create account */}
            <div className="flex-1 space-y-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  placeholder="User Name"
                  className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSignUp}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors"
                >
                  Sign up
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-l border-gray-300"></div>

            {/* Right side - Login */}
            <div className="flex-1 flex items-center justify-end w-5">
              <button
                onClick={handleLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors w-2"
              >
                Login
              </button>
            </div>
          </div>
        </div>

        {address && credential && (
          <div className={`p-4 bg-green-300 rounded-md mt-6`}>
            <h3 className="text-lg font-semibold text-gray-800">
              The Passkey account has been successfully created
            </h3>
            <p className="text-sm text-gray-700 mt-2">
              Address: <span className="font-mono break-all">{address}</span>
            </p>
            <p className="text-sm text-gray-700 mt-2">
              Public Key Credential:{" "}
              <span className="font-mono break-all">
                {credential.publicKey}
              </span>
            </p>
            {receipt && (
              <p className="text-sm text-gray-700 mt-2">
                Transaction Hash:{" "}
                <span className="font-mono break-all">
                  {receipt.transactionHash}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
      <br />
      <MintCard address={address} />
      <br />
      <TransferCard />
    </div>
  );
};
