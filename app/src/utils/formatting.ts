import { formatEther } from "viem";

export function formatHash(
  hash: `0x${string}` | null | undefined,
  size?: number,
): string | null | undefined {
  let stringSize = size || 4;
  if (!hash) return hash;
  return hash.slice(0, stringSize + 2) + "..." + hash.slice(-stringSize);
}

export function formatBalance(value?: bigint, precision?: number): string {
  if (!value) return "-";

  let n = precision || 8;
  const str = formatEther(value);
  return str.length > n ? str.slice(0, n) : str;
}
