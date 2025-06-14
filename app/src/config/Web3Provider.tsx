import { WagmiProvider, createConfig, http, } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { L1, L2 } from "./layers";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [L1, L2],
    transports: {
      // RPC URL for each chain
      [L1.id]: http(import.meta.env.VITE_L1_RPC_URL),
      [L2.id]: http(import.meta.env.VITE_L2_RPC_URL), // Replace with your L2 RPC URL
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

export const queryClient = new QueryClient();

export const Web3Provider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
