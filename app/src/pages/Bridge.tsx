import { useAccount } from "wagmi"
import { Deposit } from "../components/Deposit/Deposit"
import { WithdrawForm } from "../components/Withdraw/Form"

export const Bridge: React.FC = () => {
  const { chainId, isConnected, isDisconnected } = useAccount()

  if (isConnected && (chainId == import.meta.env.VITE_L1_CHAIN_ID))
    return <Deposit />

  if (isConnected && (chainId == import.meta.env.VITE_L2_CHAIN_ID))
    return <WithdrawForm />

  if (isDisconnected)
    return (
      <p className="text-xl text-gray-600">Connect your wallet to get started.</p>
    )

  return (
    <p className="text-xl text-gray-600">You must be connected to a valid network</p>
  )

}
