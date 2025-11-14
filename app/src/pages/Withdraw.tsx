import { useAccount } from "wagmi"
import { Withdraw } from "../components/Withdraw"

export const Bridge: React.FC = () => {
  const { isConnected, isDisconnected } = useAccount()

  if (isConnected)
    return <Withdraw />

  if (isDisconnected)
    return (
      <p className="text-xl text-gray-600">Connect your wallet to get started.</p>
    )

  return (
    <p className="text-xl text-gray-600">You must be connected to a valid network</p>
  )

}
