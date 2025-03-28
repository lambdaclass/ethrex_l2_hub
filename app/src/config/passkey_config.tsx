import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { L2 } from './layers'

export const queryClient = new QueryClient()

export const wagmiConfig = createConfig({
    chains: [L2],
    pollingInterval: 1000,
    transports: {
        [L2.id]: http(),
    },

})

export const client = wagmiConfig.getClient()
export type Client = typeof client
