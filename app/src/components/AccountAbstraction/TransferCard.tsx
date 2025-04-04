import { Credential } from "webauthn-p256";
import { transferToken } from "../../utils/token";
import { Address } from "viem";
import { Client } from "../../config/Web3Provider";

export default function TransferCard({
  client,
  address,
  credential,
}: {
  client: Client;
  address: Address | null;
  credential: Credential | null;
}) {
  const handleTransfer = async () => {
    const receipt = await transferToken(
      client,
      address!,
      "0x06C1F67013cF77F2e59ae4ff3E62aF347a63a19e",
      100n,
      credential!.id,
    );
    console.log(receipt);
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
          className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Amount"
            className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors"
            onClick={handleTransfer}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
