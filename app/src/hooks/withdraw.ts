import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi"
import CommonBridgeL2Abi from "../../abi/CommonBridgeL2.json"
import { Log } from "viem"


const commondProps = {
  abi: CommonBridgeL2Abi,
  address: import.meta.env.VITE_L2_BRIDGE_ADDRESS,
}

export type WithdrawProps = {
  amount: bigint
}

export type WithdrawalInitiatedProps = {
  onLogs: (logs: Log[]) => void
  args?: {
    receiverOnL1?: string
    senderOnL2?: string
    amount?: bigint
  }
}

export const useWithdraw = ({ amount }: { amount: bigint }) => {
  const { address } = useAccount()
  const { writeContract, writeContractAsync, ...useWriteContractValues } = useWriteContract()

  const withdraw = () =>
    writeContract({
      ...commondProps,
      functionName: 'withdraw',
      args: [address],
      value: amount,
    })

  return { withdraw, ...useWriteContractValues }
}

export const useWatchWithdrawalInitiated = ({ onLogs, args }: WithdrawalInitiatedProps) => {
  return useWatchContractEvent({
    address: import.meta.env.VITE_L2_BRIDGE_ADDRESS,
    abi: CommonBridgeL2Abi,
    eventName: "WithdrawalInitiated",
    poll: true,
    pollingInterval: 1000,
    args,
    onLogs
  })
}
