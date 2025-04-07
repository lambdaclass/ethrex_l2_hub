import { transferToken } from "../../utils/token";
import { type Address, type TransactionReceipt } from "viem";
import { type Client } from "../../config/Web3Provider";
import { useState } from "react";
import Loading from "../Loading";

export default function TransferCard({
  client,
  address,
  credentialId,
}: {
  client: Client;
  address: Address | null;
  credentialId: string | null;
}) {
  const [recipient, setRecipient] = useState<string>("");
  const [value, setValue] = useState<bigint>(0n);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTransfer = async () => {
    setReceipt(null);

    if (!recipient?.startsWith("0x")) {
      return;
    }

    setLoading(true);
    const _receipt = await transferToken(
      client,
      address!,
      recipient as `0x${string}`,
      value * 1000000000000000000n,
      credentialId!,
    );

    setLoading(false);
    setReceipt(_receipt);
  };

  return (
    <div className="example">
      <p className="text-lg text-gray-800">
        <span className="font-bold text-2xl text-blue-600">3</span>. Transfer
        tokens
      </p>

      <hr className="border-gray-300 my-4" />

      <div className="space-y-4 mt-4 max-w-md">
        <input
          type="text"
          placeholder="Recipient Address"
          onChange={(e) => setRecipient(e.currentTarget.value)}
          className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Amount"
            onChange={(e) => setValue(BigInt(e.currentTarget.value))}
            className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="disabled:bg-gray-400 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors cursor-pointer disabled:cursor-auto"
            disabled={address === null}
            onClick={handleTransfer}
          >
            Send
          </button>
        </div>
      </div>

      {loading && <Loading />}

      {!loading && receipt?.status === "success" && (
        <div className="p-4 bg-green-300 rounded-md mt-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Tokens transferred successfully!
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
