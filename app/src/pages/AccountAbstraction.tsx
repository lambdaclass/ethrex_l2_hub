import { useEffect } from "react"
import { hexToBytes } from "viem"
import { useSwitchChain } from "wagmi"
import {
    type PublicKey,
    createCredential,
    parsePublicKey,
    sign,
} from 'webauthn-p256'

export const AccountAbstraction: React.FC = () => {
    const { switchChain } = useSwitchChain()
    useEffect(() => {
        switchChain({ chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) })
    }, [])

    const handleSignup = () => {
        const publicKey = createCredential({
            user: {
                name: 'Ethrex Passkey',
                id: hexToBytes('0x01')
            }
        })

    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-center">Passkey Demo</h2>
            <p className="text-lg text-gray-800">This page demonstrates the use of the Account Abstraction feature on Ethrex.</p>
            <br />
            <div className="example">
                <p className="text-lg text-gray-800">
                    <span className="font-bold text-2xl text-blue-600">1</span>.
                    Create or login with your passkey account
                </p>

                <hr className="border-gray-300" />
                <div className="flex gap-4 mt-4 max-w-xs">
                    <button
                        onClick={handleSignup}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors">
                        Sign Up
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md flex-1 transition-colors">
                        Login
                    </button>
                </div>

            </div>
            <br />
            <div className="example">
                <p className="text-lg text-gray-800">
                    <span className="font-bold text-2xl text-blue-600">2</span>.
                    Mint some free tokens
                </p>

                <hr className="border-gray-300 my-4" />

                <div className="flex gap-4 mt-4 max-w-md">
                    <input
                        type="number"
                        defaultValue="100"
                        className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors">
                        Mint
                    </button>
                </div>
            </div>

            <br />
            <div className="example">
                <p className="text-lg text-gray-800">
                    <span className="font-bold text-2xl text-blue-600">3</span>.
                    Transfer tokens
                </p>

                <hr className="border-gray-300 my-4" />

                <div className="space-y-4 mt-4 max-w-md">
                    <input
                        type="text"
                        placeholder="Recipient Address"
                        className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Amount"
                            className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors">
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
