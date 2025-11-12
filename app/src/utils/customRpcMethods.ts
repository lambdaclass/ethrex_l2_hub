import { PublicClient } from "viem";

export type WithdrawalProof = {
  batch_number: bigint;
  index: number;
  withdrawal_hash: `0x${string}`;
  merkle_proof: `0x${string}`[];
};

type L1MessageProof = {
  batch_number: number;
  message_id: string;
  message_hash: `0x${string}`;
  merkle_proof: `0x${string}`[];
};

export async function getWithdrawalProof(
  client: PublicClient,
  txHash: `0x${string}`
): Promise<WithdrawalProof> {
  const result = (await client.request({
    method: "ethrex_getMessageProof" as any,
    params: [txHash],
  })) as L1MessageProof[];

  console.log("Result Message Proof:", result);

  if (!result || result.length === 0) {
    throw new Error(
      "No withdrawal proof found for the given transaction hash yet"
    );
  }

  // Take the first element of the array
  const proof = result[0];

  return {
    batch_number: BigInt(proof.batch_number),
    index: parseInt(proof.message_id, 16),
    withdrawal_hash: proof.message_hash,
    merkle_proof: proof.merkle_proof,
  };
}
