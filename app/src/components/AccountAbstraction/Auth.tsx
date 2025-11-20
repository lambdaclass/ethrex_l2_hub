import { useState } from "react";
import { login, signUp } from "../../utils/passkeyAccounts";
import { type Address } from "viem";
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
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"create" | "login">("create");

  const handleSignUp = async () => {
    if (!username) {
      setError("Please enter a username");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { address, credential } = await signUp({ client, username });

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
    setError(null);
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
    <div className="grow flex items-center">
      <div className="glass rounded-3xl p-8 w-full max-w-md shadow-xl mx-auto my-auto">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setActiveTab("create");
              setError(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "create"
              ? "bg-white text-indigo-600 shadow-md"
              : "text-gray-600 hover:bg-white/30"
              }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              setActiveTab("login");
              setError(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${activeTab === "login"
              ? "bg-white text-indigo-600 shadow-md"
              : "text-gray-600 hover:bg-white/30"
              }`}
          >
            Login
          </button>
        </div>

        {/* Create Account Tab */}
        {activeTab === "create" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Get Started</h2>
                <p className="text-sm text-gray-600">Create your account with a passkey</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-sm mb-2 font-medium">Username</label>
              <input
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                placeholder="Choose your username"
                disabled={loading}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-gray-800 bg-white"
              />
            </div>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="main-button w-full flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-5 h-5">
                  <div className="spinner w-5 h-5"></div>
                </div>
              )}
              {loading ? "Creating..." : "Create Account"}
            </button>

          </div>
        )}

        {/* Login Tab */}
        {activeTab === "login" && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Welcome Back</h2>
                <p className="text-sm text-gray-600">Login with your stored passkey</p>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="bg-white/60 rounded-xl p-4 text-center min-h-[78px] flex items-center justify-center">
              <p className="text-sm text-gray-700">
                Click below to authenticate with your stored passkey
              </p>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="main-button w-full flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-5 h-5">
                  <div className="spinner w-5 h-5"></div>
                </div>
              )}
              {loading ? "Logging in..." : "Login with Passkey"}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
