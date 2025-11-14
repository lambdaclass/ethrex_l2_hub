import {
  useAccount,
  usePublicClient,
  useWalletClient,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import CommonBridgeL1Abi from "../../abi/CommonBridgeL1.json";
import CommonBridgeL2Abi from "../../abi/CommonBridgeL2.json";
import { Address, Log, parseEther, PublicClient } from "viem";
import { getWithdrawalProof, WithdrawalProof } from "../utils/customRpcMethods";
import { useCallback, useState } from "react";
import { waitForTransactionReceipt } from "viem/actions";
import { FailureData, SuccessData } from "../components/Withdraw/Modal";

const commondPropsL2 = {
  abi: CommonBridgeL2Abi,
  address: import.meta.env.VITE_L2_BRIDGE_ADDRESS,
  chainId: Number(import.meta.env.VITE_L2_CHAIN_ID),
};

const commondPropsL1 = {
  abi: CommonBridgeL1Abi,
  address: import.meta.env.VITE_L1_BRIDGE_ADDRESS,
  chainId: Number(import.meta.env.VITE_L1_CHAIN_ID),
};

export type WithdrawalInitiatedProps = {
  onLogs: (logs: Log[]) => void;
  args?: {
    receiverOnL1?: Address;
    senderOnL2?: Address;
    amount?: bigint;
  };
};

export const useClaimWithdraw = ({
  amount,
  proof,
}: {
  amount: bigint;
  proof: WithdrawalProof;
}) => {
  const { writeContract, ...useWriteContractValues } = useWriteContract();

  const claimWithdraw = () =>
    writeContract({
      ...commondPropsL1,
      functionName: "claimWithdrawal",
      args: [amount, proof.batch_number, proof.index, proof.merkle_proof],
    });

  return { claimWithdraw, ...useWriteContractValues };
};

export const useClaimWithdraw2 = () => {
  const { data: client } = useWalletClient();

  const claimWithdraw = useCallback(
    async (amount: bigint, proof: WithdrawalProof) => {
      if (!client) throw new Error("Wallet client not available");

      try {
        const txHash = await client.writeContract({
          ...commondPropsL1,
          functionName: "claimWithdrawal",
          args: [amount, proof.batch_number, proof.index, proof.merkle_proof],
        });

        const receipt = await waitForTransactionReceipt(client, {
          hash: txHash,
        });

        if (receipt.status !== "success") {
          throw { receipt, message: "The transaction was reverted." };
        }

        return { receipt, amount: amount };
      } catch (error: any) {
        throw {
          amount,
          receipt: error["receipt"],
          message:
            error["message"] || "An unknown error occurred during withdrawal.",
        };
      }
    },
    [client],
  );
  return { claimWithdraw: !client ? undefined : claimWithdraw };
};

export const useWatchWithdrawalInitiated = ({
  onLogs,
  args,
}: WithdrawalInitiatedProps) => {
  return useWatchContractEvent({
    ...commondPropsL2,
    eventName: "WithdrawalInitiated",
    poll: true,
    pollingInterval: 1000,
    args,
    onLogs,
  });
};

export const useClaimProof = (txHash: `0x${string}`) => {
  const { address } = useAccount();
  const client = usePublicClient({
    chainId: Number(import.meta.env.VITE_L2_CHAIN_ID),
  });
  const [proof, setProof] = useState<WithdrawalProof | undefined>();

  const waitWithdrawalProof = async (
    client: PublicClient,
    txHash: `0x${string}`,
  ) => {
    try {
      console.log("Attempting to fetch withdrawal proof...");
      const proof = await getWithdrawalProof(client, txHash);
      console.log("Fetched withdrawal proof:", proof);
      setProof(proof);
    } catch (error) {
      console.log(
        "Withdrawal proof not available yet, retrying in 5 seconds...",
      );
      setTimeout(() => waitWithdrawalProof(client, txHash), 5000);
    }
  };

  useWatchWithdrawalInitiated({
    onLogs: (_logs) => {
      console.log("WithdrawalInitiated event detected in watcher.");
      if (client) {
        console.log("WithdrawalInitiated event detected, fetching proof...");
        waitWithdrawalProof(client, txHash);
      }
    },
    args: { senderOnL2: address, receiverOnL1: address },
  });

  return { proof, isLoading: !proof };
};

export type WithdrawStep = "init" | "waiting-receipt" | "receipt-received";

export const useWithdraw = () => {
  const { data: client } = useWalletClient();
  const [step, setStep] = useState<WithdrawStep>("init");

  const withdraw = useCallback(
    async (amount: bigint): Promise<SuccessData | FailureData> => {
      if (!client) throw new Error("Wallet client not available");

      try {
        const txHash = await client.writeContract({
          ...commondPropsL2,
          functionName: "withdraw",
          args: [client.account.address],
          value: amount,
        });

        setStep("waiting-receipt");

        const receipt = await waitForTransactionReceipt(client, {
          hash: txHash,
        });

        if (receipt.status !== "success") {
          throw { receipt, message: "The transaction was reverted." };
        }

        setStep("receipt-received");

        return { receipt, amount: amount };
      } catch (error: any) {
        throw {
          amount,
          receipt: error["receipt"],
          message:
            error["message"] || "An unknown error occurred during withdrawal.",
        };
      }
    },
    [client, setStep],
  );

  return { withdraw: !client ? undefined : withdraw, step };
};
