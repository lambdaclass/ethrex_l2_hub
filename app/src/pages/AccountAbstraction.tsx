import { useEffect, useState } from "react"
import { useSwitchChain } from "wagmi"
import { client } from "../config/passkey_config"
import { newAccount } from '../utils/passkeyAccounts'
import { PrivateKeyAccount, TransactionReceipt } from "viem"
import { CreateCredentialReturnType } from "webauthn-p256"

export const AccountAbstraction: React.FC = () => {
    const [username, setUsername] = useState<string>('')

    const [account, setAccount] = useState<PrivateKeyAccount | null>(null)
    const [credential, setCredential] = useState<CreateCredentialReturnType | null>(null)
    const [receipt, setReceipt] = useState<TransactionReceipt | null>(null)

    const { switchChain } = useSwitchChain()
    useEffect(() => {
        switchChain({ chainId: Number(import.meta.env.VITE_L2_CHAIN_ID) })
    }, [])

    const handleSignup = async () => {
        const { account, credential, receipt } = await newAccount({ client, username })
        console.log(account)
        console.log(credential)
        console.log(receipt)
        setAccount(account)
        setCredential(credential)
        setReceipt(receipt)
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4 text-center">Passkey Demo</h2>
            <p className="text-lg text-gray-800">This page demonstrates the use of the Account Abstraction feature on Ethrex.</p>
            <br />
            <div className="example">
                <p className="text-lg text-gray-800">
                    <span className="font-bold text-2xl text-blue-600">1</span>.
                    Create a passkey account
                </p>

                <hr className="border-gray-300 my-4" />

                <div className="space-y-4 mt-4 max-w-md">
                    <div className="flex gap-4">
                        <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                            placeholder="User Name"
                            className="border border-gray-300 rounded-md py-2 px-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleSignup}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex-1 transition-colors">
                            Sign up
                        </button>
                    </div>
                </div>
                {account && credential && receipt &&
                    <div className={`p-4 bg-green-300 rounded-md mt-6`}>
                        <h3 className="text-lg font-semibold text-gray-800">The Passkeyy account has been succesfully created</h3>
                        <p className="text-sm text-gray-700 mt-2">
                            Address:{" "}
                            <span className="font-mono break-all">{account.address}</span>
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                            Public Key Credential:{" "}
                            <span className="font-mono break-all">{credential.publicKey}</span>
                        </p>
                        <p className="text-sm text-gray-700 mt-2">
                            Transaction Hash:{" "}
                            <span className="font-mono break-all">{receipt.transactionHash}</span>
                        </p>
                    </div>}

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
