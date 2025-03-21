import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { type Chain } from 'viem'


export const ethrexL1Local = {
    id: 9,
    name: 'Ethrex L1 Local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['http://localhost:8545'] },
    }

} as const satisfies Chain

export const ethrexL2Local = {
    id: 1729,
    name: 'Ethrex L2 Local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['http://localhost:1729'] },
    }

} as const satisfies Chain


const config = createConfig(
    getDefaultConfig({
        // Your dApps chains
        chains: [ethrexL1Local, ethrexL2Local],
        transports: {
            // RPC URL for each chain
            [ethrexL1Local.id]: http(),
            [ethrexL2Local.id]: http(),
        },

        // Required API Keys
        walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,

        // Required App Info
        appName: "Ethrex Hub",

        // Optional App Info
        appDescription: "Bridging, wallet and services for Ethrex L2 Chains",
        appUrl: import.meta.env.BASE_URL, // your app's url
        appIcon: `${import.meta.env.BASE_URL}/logo.png`, // your app's icon, no bigger than 1024x1024px (max. 1MB)
    }),
);

const queryClient = new QueryClient();

export const Web3Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <ConnectKitProvider>{children}</ConnectKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
};
