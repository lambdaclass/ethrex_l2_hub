import { useAccount, useWatchContractEvent, useWriteContract } from "wagmi"
import CommonBridgeL1Abi from "../../abi/CommonBridgeL1.json"
import CommonBridgeL2Abi from "../../abi/CommonBridgeL2.json"
import { Address, Log } from "viem"
import { WithdrawalProof } from "../utils/customRpcMethods"


const commondPropsL2 = {
  abi: CommonBridgeL2Abi,
  address: import.meta.env.VITE_L2_BRIDGE_ADDRESS,
}

const commondPropsL1 = {
  abi: CommonBridgeL1Abi,
  address: import.meta.env.VITE_L1_BRIDGE_ADDRESS,
}

export type WithdrawProps = {
  amount: bigint
}

export type WithdrawalInitiatedProps = {
  onLogs: (logs: Log[]) => void
  args?: {
    receiverOnL1?: Address,
    senderOnL2?: Address,
    amount?: bigint
  }
}

export const useWithdraw = ({ amount }: { amount: bigint }) => {
  const { address } = useAccount()
  const { writeContract, writeContractAsync, ...useWriteContractValues } = useWriteContract()

  const withdraw = () =>
    writeContract({
      ...commondPropsL2,
      functionName: 'withdraw',
      args: [address],
      value: amount,
    })

  return { withdraw, ...useWriteContractValues }
}

export const useClaimWithdraw = ({ amount, proof }: { amount: bigint, proof: WithdrawalProof }) => {
  const { writeContract, writeContractAsync, ...useWriteContractValues } = useWriteContract()

  const claimWithdraw = () =>
    writeContract({
      ...commondPropsL1,
      functionName: 'claimWithdrawal',
      args: [
        proof.withdrawal_hash,
        amount,
        proof.batch_number,
        proof.index,
        proof.merkle_proof
      ]
    })

  return { claimWithdraw, ...useWriteContractValues }
}

export const useWatchWithdrawalInitiated = ({ onLogs, args }: WithdrawalInitiatedProps) => {
  return useWatchContractEvent({
    ...commondPropsL2,
    eventName: "WithdrawalInitiated",
    poll: true,
    pollingInterval: 1000,
    args,
    onLogs
  })
}
