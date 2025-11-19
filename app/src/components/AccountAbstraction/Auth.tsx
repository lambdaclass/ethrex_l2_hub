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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="form--container glass">
        <h2 className="form--header">Passkey Account</h2>

        <div className="form--small-text text-center">
          <p>Create an account or login with your passkey</p>
        </div>

        {error && (
          <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="w-full flex flex-col space-y-5">
          {/* Sign Up Section */}
          <div className="space-y-3">
            <label className="form--label">Create Account</label>
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="Enter username"
              disabled={loading}
            />
            <button
              onClick={handleSignUp}
              disabled={loading}
              className="main-button w-full"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
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
          <div className="space-y-3">
            <label className="form--label">Already have an account?</label>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login with Passkey"}
            </button>
          </div>
        </div>

        {loading && (
          <div className="mt-4">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
}
