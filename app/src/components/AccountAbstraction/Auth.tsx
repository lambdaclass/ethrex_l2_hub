import { useState } from "react";
import { Loading } from "../Loading";
import { login, signUp } from "../../utils/passkeyAccounts";
import { type TransactionReceipt, type Address } from "viem";
import { type CreateCredentialReturnType } from "webauthn-p256";
import { client } from "../../config/passkey_config";

interface AuthProps {
  onAuthSuccess: (
    address: Address,
    credential: CreateCredentialReturnType,
    username?: string
  ) => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSignUp = async () => {
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { address, credential, receipt } = await signUp({ client, username });

      // Save username to localStorage
      localStorage.setItem("passkey_username", username);
      localStorage.setItem("passkey_address", address);

      onAuthSuccess(address, credential, username);
    } catch (err) {
      setError("Failed to create account. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { address, credential } = await login({ client });

      // Retrieve username from localStorage if it exists
      const savedUsername = localStorage.getItem("passkey_username") || undefined;

      onAuthSuccess(address, credential, savedUsername);
    } catch (err) {
      setError("Failed to login. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Passkey Account</h1>
          <p className="text-gray-600">Create an account or login with your passkey</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Sign Up Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Create Account</h2>
            <div className="space-y-3">
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                placeholder="Enter username"
                className="w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={loading}
              />
              <button
                onClick={handleSignUp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">OR</span>
            </div>
          </div>

          {/* Login Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Login</h2>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? "Logging in..." : "Login with Passkey"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-6">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}
