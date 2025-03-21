import type { Chain } from "viem";

export const L1 = {
    id: parseInt(import.meta.env.VITE_L1_CHAIN_ID),
    name: import.meta.env.VITE_L1_NAME,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: [import.meta.env.VITE_L1_RPC_URL] }
    }
} as const satisfies Chain;

export const L2 = {
    id: parseInt(import.meta.env.VITE_L2_CHAIN_ID),
    name: import.meta.env.VITE_L2_NAME,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: [import.meta.env.VITE_L2_RPC_URL] }
    }
} as const satisfies Chain;
