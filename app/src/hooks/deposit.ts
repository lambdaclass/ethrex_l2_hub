import { useSendTransaction, useWatchContractEvent } from "wagmi"
import CommonBridgeL1Abi from "../../abi/CommonBridgeL1.json"
import { Address, Log } from "viem"

const commondProps = {
    abi: CommonBridgeL1Abi,
    address: import.meta.env.VITE_L1_BRIDGE_ADDRESS,
    chainId: Number(import.meta.env.VITE_L1_CHAIN_ID),
}

export type useDepositProps = {
    amount: bigint
}

export type DepositInitiatedProps = {
    onLogs: (logs: Log[]) => void
    args?: {
        amount?: bigint,
        to?: Address,
        depistId?: bigint,
        recipient?: Address,
        from?: Address,
        gasLimit?: bigint,
        data?: string,
        l2MintTxhash?: string,
    }
}

export const useDeposit = ({ amount }: useDepositProps) => {

    const { sendTransaction, sendTransactionAsync, ...useSendTransactionValues } = useSendTransaction()

    const deposit = () =>
        sendTransactionAsync({
            to: import.meta.env.VITE_L1_BRIDGE_ADDRESS,
            value: amount,
            chainId: Number(import.meta.env.VITE_L1_CHAIN_ID),
        })

    return { deposit, ...useSendTransactionValues }
}

export const useWatchDepositInitiated = ({ onLogs, args }: DepositInitiatedProps) => {
    return useWatchContractEvent({
        ...commondProps,
        eventName: "DepositInitiated",
        poll: true,
        pollingInterval: 1000,
        args,
        onLogs
    })
}
