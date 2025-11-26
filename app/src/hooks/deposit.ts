import CommonBridgeL1Abi from "../../abi/CommonBridgeL1.json";
import { useWalletClient, useWatchContractEvent } from "wagmi";
import { Address, Log, TransactionReceipt } from "viem";
import { useCallback, useState } from "react";
import { sendTransaction, waitForTransactionReceipt } from "viem/actions";
import { useBridgeConfig } from "../components/BridgeConfigContext";

const useCommonProps = () => {
  const { l1BridgeAddress } = useBridgeConfig();
  return {
    abi: CommonBridgeL1Abi,
    address: l1BridgeAddress,
    chainId: Number(import.meta.env.VITE_L1_CHAIN_ID),
  };
};

type DepositError = {
  receipt?: TransactionReceipt | null;
  message?: string;
};

export type DepositStep =
  | "idle"
  | "signing"
  | "reverted"
  | "waiting_signature_receipt"
  | "done"
  | "error";

// export type useDepositProps = {
//     amount: bigint
// }

export type DepositInitiatedProps = {
  onLogs: (logs: Log[]) => void;
  args?: {
    amount?: bigint;
    to?: Address;
    depistId?: bigint;
    recipient?: Address;
    from?: Address;
    gasLimit?: bigint;
    data?: string;
    l2MintTxhash?: string;
  };
};

// export const useDeposit = ({ amount }: useDepositProps) => {

//     const { sendTransaction, sendTransactionAsync, ...useSendTransactionValues } = useSendTransaction()

//     const deposit = () =>
//         sendTransactionAsync({
//             to: import.meta.env.VITE_L1_BRIDGE_ADDRESS,
//             value: amount,
//             chainId: Number(import.meta.env.VITE_L1_CHAIN_ID),
//         })

//     return { deposit, ...useSendTransactionValues }
// }

export const useDeposit = () => {
  const { data: walletClient } = useWalletClient();
  const { l1BridgeAddress } = useBridgeConfig();
  const [step, setStep] = useState<DepositStep>("idle");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);

  const deposit = useCallback(
    async (amount: bigint) => {
      if (!walletClient) {
        throw { message: "Wallet not connected", step: "init" };
      }

      if (!l1BridgeAddress) {
        throw { message: "Bridge address not available", step: "init" };
      }

      setStep("signing");

      try {
        const tx = await walletClient.sendTransaction({
          to: l1BridgeAddress,
          value: amount,
          chainId: Number(import.meta.env.VITE_L1_CHAIN_ID),
        });

        console.log(sendTransaction);

        setTxHash(tx);
        setStep("waiting_signature_receipt");

        const receipt = await waitForTransactionReceipt(walletClient, {
          hash: tx,
        });

        if (receipt.status !== "success") {
          throw {
            receipt,
            amount,
            message: "The transaction was reverted",
          };
        }

        setStep("done");

        return {
          amount,
          submissionTxHash: tx,
          receipt,
        };
      } catch (error) {
        const err = error as DepositError;

        throw {
          amount,
          receipt: err["receipt"],
          message:
            err["message"] || "An unknown error occurred during deposit.",
        };
      }
    },
    [walletClient, l1BridgeAddress]
  );

  return {
    deposit: walletClient ? deposit : undefined,
    step,
    txHash,
  };
};

export const useWatchDepositInitiated = ({
  onLogs,
  args,
}: DepositInitiatedProps) => {
  const commonProps = useCommonProps();
  return useWatchContractEvent({
    ...commonProps,
    eventName: "DepositInitiated",
    poll: true,
    pollingInterval: 1000,
    args,
    onLogs,
  });
};
