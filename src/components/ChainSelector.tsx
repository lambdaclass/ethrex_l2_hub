import { useAccount, useChainId, useSwitchChain } from 'wagmi'

export const ChainSelector: React.FC = () => {
  const { isDisconnected, chainId } = useAccount()
  const { chains, switchChain } = useSwitchChain()

  const setSelectedChain = (chainId: string) => {
    switchChain({ chainId: Number(chainId) })
  }

  if (isDisconnected) return <></>

  return (
    <select
      value={chainId}
      onChange={(e) => setSelectedChain(e.target.value)}
      className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200 focus:outline-none"
    >
      {chains.map((chain) => (
        <option key={chain.id} value={chain.id}>
          {chain.name}
        </option>
      ))}
    </select>
  );
}
