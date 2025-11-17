import React, { useEffect, useState } from "react";
import { FaEthereum } from "react-icons/fa";
import { BsClouds } from "react-icons/bs";
import { useAccount, useBalance } from "wagmi";
import { WithdrawModal } from "./Modal";
import { useL2Chain } from "../../hooks/commons";
import { formatBalance } from "../../utils/formatting";

export const WithdrawForm: React.FC = () => {
  useL2Chain();
  const { address } = useAccount();
  const { data: balanceData, refetch: refetchBalance } = useBalance({
    address,
  });
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      refetchBalance();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="form--container glass">
        <h2 className="form--header">Withdraw Funds</h2>

        <div className="form--small-text text-center">
          <p>Withdraw your funds to the Ethereum Mainnet.</p>
        </div>

        <form className="w-full flex flex-col space-y-5">
          <div>
            <label className="form--label">From</label>
            <div className="form--fixed-input">
              <span className="font-medium">Ethrex Layer 2</span>
              <BsClouds className="w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="form--label">To</label>
            <div className="form--fixed-input">
              <span className="font-medium">Ethereum</span>
              <FaEthereum className="w-5 h-5" />
            </div>
          </div>

          <div>
            <label className="form--label">Amount (ETH)</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.00001"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="form--small-text text-right mt-1">
              Balance: {formatBalance(balanceData?.value)} ETH
            </div>
          </div>

          <button
            type="button"
            className="main-button"
            onClick={openModal}
            disabled={modalIsOpen}
          >
            Withdraw
          </button>
        </form>

        <div className="form--small-text text-center">
          <p>Estimated completion: ~5 minutes</p>
        </div>
      </div>

      {modalIsOpen && (
        <WithdrawModal closeModal={closeModal} submissionData={{ amount }} />
      )}
    </>
  );
};
