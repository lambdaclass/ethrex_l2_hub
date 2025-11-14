export function formatHash(
  hash: `0x${string}` | undefined,
): string | undefined {
  if (!hash) return undefined;
  return hash.slice(0, 6) + "..." + hash.slice(-4);
}
