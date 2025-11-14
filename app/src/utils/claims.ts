import { ClaimData } from "../components/Withdraw/ClaimItem";

export function fetchClaims(address: `0x${string}`): ClaimData[] {
  const storage = JSON.parse(localStorage.getItem("withdrawalProofs") || "[]");
  storage.filter((p: ClaimData) => p.address === address);
  return storage;
}

export function storeClaim(claim: ClaimData): void {
  const storage = JSON.parse(localStorage.getItem("withdrawalProofs") || "[]");
  storage.push(claim);
  localStorage.setItem("withdrawalProofs", JSON.stringify(storage));
}

export function updateClaimStatus(
  txHash: `0x${string}`,
  claimed: boolean,
): void {
  const storage = JSON.parse(localStorage.getItem("withdrawalProofs") || "[]");
  const index = storage.findIndex(
    (p: ClaimData) => p.transaction_hash === txHash,
  );

  if (index !== -1) {
    storage[index].claimed = claimed;
    console.log("Updating claim status:", storage[index]);
    localStorage.setItem("withdrawalProofs", JSON.stringify(storage));
  }
}
