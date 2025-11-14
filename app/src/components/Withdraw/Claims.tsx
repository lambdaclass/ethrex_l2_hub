import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

import { ClaimData, ClaimItem } from "./ClaimItem";
import { fetchClaims } from "../../utils/claims";

export const Claims: React.FC = () => {
  const { address } = useAccount();
  const [claims, setClaims] = useState<ClaimData[]>([]);

  // Cargar claims del usuario
  const loadClaims = () => {
    if (!address) return;
    const claims = fetchClaims(address);
    setClaims(claims);
  };

  useEffect(() => {
    loadClaims();

    const interval = setInterval(() => {
      loadClaims();
    }, 5000);

    return () => clearInterval(interval);
  }, [address]);

  return (
    <section className="glass rounded-3xl p-8 shadow-lg w-4xl">
      <h3 className="text-2xl font-semibold text-gray-900 text-center mb-6">
        My Claims
      </h3>

      {claims.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {claims.map((claim, index) => (
            <ClaimItem key={index} index={index} claim={claim} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-10">
          No pending claims found.
        </div>
      )}
    </section>
  );
};
