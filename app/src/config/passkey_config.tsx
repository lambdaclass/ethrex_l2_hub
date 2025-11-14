import { http, createConfig } from "wagmi";
import { L2 } from "./layers";

export const wagmiConfig = createConfig({
  chains: [L2],
  pollingInterval: 1000,
  transports: {
    [L2.id]: http(),
  },
});

export const client = wagmiConfig.getClient();
const base_request = client.request;

client.request = async ({ method, params }) => {
  if (method === "eth_sendTransaction") {
    method = "ethrex_sendTransaction";
  }

  return base_request({ method: method as any, params: params as any });
};

export type Client = typeof client;
