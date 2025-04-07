import { useState } from "react";
import Loading from "../Loading";
import { login, signUp } from "../../utils/passkeyAccounts";
import { type TransactionReceipt, type Address } from "viem";
import { type CreateCredentialReturnType } from "webauthn-p256";
import { client } from "../../config/passkey_config";

export default function AccountCard({
  address,
  setAddress,
  credential,
  setCredential,
}: {
  address: Address | null;
  setAddress: React.Dispatch<React.SetStateAction<Address | null>>;
  credential: CreateCredentialReturnType | null;
  setCredential: React.Dispatch<
    React.SetStateAction<CreateCredentialReturnType | null>
  >;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);

  const handleSignUp = async () => {
    setLoading(true);
    const { address, credential, receipt } = await signUp({ client, username });
    setLoading(false);
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
    <div className="example">
      <div className="flex items-center justify-between">
        <p className="text-lg text-gray-800">
          <span className="font-bold text-2xl text-blue-600">1</span>. Create a
          passkey account or Login
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
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors cursor-pointer"
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
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors w-2 cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>
      </div>

      {loading && <Loading />}

      {!loading && address && credential && (
        <div className={`p-4 bg-green-300 rounded-md mt-6`}>
          <h3 className="text-lg font-semibold text-gray-800">
            The Passkey account has been successfully created
          </h3>
          <p className="text-sm text-gray-700 mt-2">
            Address: <span className="font-mono break-all">{address}</span>
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Public Key Credential:{" "}
            <span className="font-mono break-all">{credential.publicKey}</span>
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
  );
}
