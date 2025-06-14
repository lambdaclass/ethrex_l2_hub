import { PublicClient } from 'viem';

export type WithdrawalProof = {
  batch_number: bigint;
  index: number;
  withdrawal_hash: `0x${string}`;
  merkle_proof: `0x${string}`[];
};

export async function getWithdrawalProof(
  client: PublicClient,
  txHash: `0x${string}`
): Promise<WithdrawalProof> {
  const result = await client.request({
    method: 'ethrex_getWithdrawalProof' as any,
    params: [txHash],
  }) as WithdrawalProof;

  if (!result) {
    throw new Error('No withdrawal proof found for the given transaction hash yet');
  }

  return {
    batch_number: BigInt(result.batch_number),
    index: result.index,
    withdrawal_hash: result.withdrawal_hash,
    merkle_proof: result.merkle_proof,
  };
}
