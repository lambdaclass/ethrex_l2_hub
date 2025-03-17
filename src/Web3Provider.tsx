import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { type Chain } from 'viem'

export const ethrexRollupLocal = {
    id: 1729,
    name: 'EthRex Rollup Local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['http://localhost:8552'] },
    }

} as const satisfies Chain

const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [ethrexRollupLocal],
        transports: {
            // RPC URL for each chain
            [ethrexRollupLocal.id]: http(),
        },

        // Required API Keys
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

        // Required App Info
        appName: "Ethrex L2 Hub",

        // Optional App Info
        appDescription: "Your App Description",
        appUrl: import.meta.env.BASE_URL, // your app's url
        appIcon: `${import.meta.env.BASE_URL}/logo.png`, // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);

const queryClient = new QueryClient();

import { ReactNode } from "react";

export const Web3Provider = ({ children }: { children: ReactNode }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
