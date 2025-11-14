import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useAccount, useBalance, useSwitchChain } from "wagmi";
import { FaEthereum } from "react-icons/fa";
import { BsClouds } from "react-icons/bs";
import { DepositModal } from "./Modal";

export const DepositForm: React.FC = () => {
  const [amount, setAmount] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const { address} = useAccount()
  const { switchChain } = useSwitchChain()
  const { data: balanceData } = useBalance({ address });

  useEffect(() => {
    switchChain({ chainId: Number(import.meta.env.VITE_L1_CHAIN_ID) })
  }, [])

  return (
    <div>
    <div className="form--container glass">
      <h2 className="form--header">Deposit Funds</h2>
       <div className="form--small-text text-center">
        <p>Bridge your ETH from Ethereum Mainnet to the Ethrex L2 network.</p>
      </div>
      <div className="w-full flex flex-col space-y-5">
        <div>
        <label className="form--label">From</label>
        <div className="form--fixed-input">
          <span className="font-medium">Ethereum (L1)</span>
          <FaEthereum className="h-5 w-2"/>
        </div>
      </div>

      <div>
        <label className="form--label">To</label>
        <div className="form--fixed-input">
          <span className="font-medium">Ethrex Layer 2</span>
          <BsClouds className="h-5 w-5"/>
        </div>
      </div>
      <div>
       <label className="form--label">Amount (ETH)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount in Ether"
        />
        <div className="mt-1 form--small-text text-right">Balance: {balanceData ? formatEther(balanceData.value) : "-"} ETH</div>
      </div>
      <button
        onClick={() => setShowModal(true)} 
        className="main-button"
      >
        Deposit
      </button>
      <div className="form--small-text text-center">
        <p>Estimated completion: ~1 minute</p>
      </div>
      </div>
    </div>
    {showModal && 
        <DepositModal submissionData={{ amount: amount }} closeModal={() => {
      setShowModal(false);
      setAmount("");
    }}  />}
    </div>
  )
}
