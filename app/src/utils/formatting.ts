export function formatHash(hash: `0x${string}`): string {
  return hash.slice(0, 6) + "..." + hash.slice(-4);
}
