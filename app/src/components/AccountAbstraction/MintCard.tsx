import { useEffect, useState } from "react";
import { client } from "../../config/passkey_config";
import { getTokenBalance, mintToken } from "../../utils/token";
import { type Address } from "viem";

export default function MintCard({ address }: { address: Address | null }) {
  const [tokens, setTokens] = useState<bigint | undefined>();
  const [mintValue, setMintValue] = useState<bigint>(100n);

  const updateTokens = () => {
    getTokenBalance(client, address!).then((_tokens) => {
      console.log("Tokens", _tokens);
      setTokens(_tokens);
    });
  };

  const handleMint = async () => {
    if (address === null) {
      return;
    }

    const _receipt = await mintToken(client, address, mintValue);
    updateTokens();
  };

  useEffect(() => {
    updateTokens();
  }, [address]);

  return (
    <div className="example">
      <p className="text-lg text-gray-800">
        <span className="font-bold text-2xl text-blue-600">2</span>. Mint some
        free tokens
      </p>
      <hr className="border-gray-300 my-4" />
      <div className="flex gap-4 mt-4 max-w-md">
        <input
          type="number"
          defaultValue="100"
          value={mintValue.toString()}
          onChange={(e) => setMintValue(BigInt(e.currentTarget.value))}
          className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="disabled:bg-gray-400 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors"
          disabled={address === null}
          onClick={handleMint}
        >
          Mint
        </button>
      </div>
      {tokens ? `Tokens: ${tokens?.toString()}` : null}
    </div>
  );
}
