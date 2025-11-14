export function formatHash(
  hash: `0x${string}` | null | undefined,
  size?: number,
): string | null | undefined {
  let stringSize = size || 4;
  if (!hash) return hash;
  return hash.slice(0, stringSize + 2) + "..." + hash.slice(-stringSize);
}
