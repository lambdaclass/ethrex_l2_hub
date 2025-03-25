import { useEffect } from "react"
import { useSwitchChain } from "wagmi"

export const AccountAbstraction: React.FC = () => {
    const { switchChain } = useSwitchChain()
    useEffect(() => {
        switchChain({ chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) })
    }, [])

    return <></>
}
