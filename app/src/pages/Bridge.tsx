import { useAccount } from "wagmi"
import { Deposit } from "../components/Deposit"
import { Withdraw } from "../components/Withdraw"

export const Bridge: React.FC = () => {
  const { chainId, isConnected, isDisconnected } = useAccount()

  if (isConnected && (chainId == import.meta.env.VITE_L1_CHAIN_ID))
    return <Deposit />

  if (isConnected && (chainId == import.meta.env.VITE_L2_CHAIN_ID))
    return <Withdraw />

  if (isDisconnected)
    return (
      <p className="text-xl text-gray-600">Connect your wallet to get started.</p>
    )

  return (
    <p className="text-xl text-gray-600">You must be connected to a valid network</p>
  )

}
