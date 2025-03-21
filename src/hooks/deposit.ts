import { useSendTransaction } from "wagmi"
import CommonBridgeL2Abi from "../../abi/CommonBridgeL2.json"

const commondProps = {
    abi: CommonBridgeL2Abi,
    address: import.meta.env.VITE_L1_BRIDGE_ADDRESS,
}

type useDepositProps = {
    amount: bigint
}

export const useDeposit = ({ amount }: useDepositProps) => {

    const { sendTransaction, sendTransactionAsync, ...useSendTransactionValues } = useSendTransaction()

    const deposit = () =>
        sendTransaction({
            to: import.meta.env.VITE_L1_BRIDGE_ADDRESS,
            value: amount,
        })

    return { deposit, ...useSendTransactionValues }
}
