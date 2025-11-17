import { useEffect } from "react";
import { useSwitchChain } from "wagmi";

function useChain(chainId: number) {
  const { switchChain } = useSwitchChain();
  useEffect(() => {
    switchChain({ chainId });
  }, [chainId, switchChain]);
}

export function useL1Chain() {
  return useChain(Number(import.meta.env.VITE_L1_CHAIN_ID));
}

export function useL2Chain() {
  return useChain(Number(import.meta.env.VITE_L2_CHAIN_ID));
}
