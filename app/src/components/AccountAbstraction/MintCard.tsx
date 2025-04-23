import { useEffect, useState } from "react";
import { getTokenBalance, mintToken } from "../../utils/token";
import { type TransactionReceipt, type Address } from "viem";
import Loading from "../Loading";
import { client } from "../../config/passkey_config";

export default function MintCard({
  address,
  credentialId,
}: {
  address: Address | null;
  credentialId: string | null;
}) {
  const [tokens, setTokens] = useState<bigint | undefined>();
  const [mintValue, setMintValue] = useState<bigint>(10n);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const updateTokens = () => {
    if (address === null) {
      return;
    }

    getTokenBalance(client, address!).then((_tokens) => {
      setTokens(_tokens);
    });
  };

  const handleMint = async () => {
    if (address === null || credentialId === null) {
      return;
    }

    setLoading(true);
    const _receipt = await mintToken(
      client,
      address,
      mintValue * 1000000000000000000n,
      credentialId!,
    );
    setLoading(false);
    setReceipt(_receipt);
    setTokens((tokens ?? 0n) + mintValue * 1000000000000000000n);
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
          defaultValue={mintValue.toString()}
          onChange={(e) => setMintValue(BigInt(e.currentTarget.value))}
          className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="disabled:bg-gray-400 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors cursor-pointer disabled:cursor-auto"
          disabled={address === null}
          onClick={handleMint}
        >
          Mint
        </button>
      </div>

      {loading && <Loading />}

      {!loading && tokens ? (
        <div className="mt-4">
          Current tokens: {(tokens / 1000000000000000000n).toString()}
        </div>
      ) : null}

      {!loading && receipt?.status === "success" && (
        <div className="p-4 bg-green-300 rounded-md mt-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Tokens minted successfully!
          </h3>
          <p className="text-sm text-gray-700 mt-2">
            Transaction Hash:{" "}
            <span className="font-mono break-all">
              {receipt.transactionHash}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
