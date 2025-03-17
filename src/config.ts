import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { type Chain } from 'viem'

export const ethrexRollupLocal = {
    id: 1729,
    name: 'EthRex Rollup Local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['http://localhost:8552'] },
    }

} as const satisfies Chain

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
    chains: [ethrexRollupLocal],
    pollingInterval: 1000,
    transports: {
        [ethrexRollupLocal.id]: http(),
    },
})

export const client = wagmiConfig.getClient()
export type Client = typeof client
