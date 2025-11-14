import { usePublicClient, useWalletClient, useWatchContractEvent } from "wagmi";
import CommonBridgeL1Abi from "../../abi/CommonBridgeL1.json";
import CommonBridgeL2Abi from "../../abi/CommonBridgeL2.json";
import { Address, Log, PublicClient } from "viem";
import { getWithdrawalProof, WithdrawalProof } from "../utils/customRpcMethods";
import { useCallback, useEffect, useState } from "react";
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

export const useClaimWithdraw = () => {
  const { data: client } = useWalletClient({
    chainId: Number(import.meta.env.VITE_L1_CHAIN_ID),
  });

  const claimWithdraw = useCallback(
    async (amount: bigint, proof: WithdrawalProof) => {
      if (!client) throw new Error("Wallet client not available");

      try {
        await client.switchChain({
          id: Number(import.meta.env.VITE_L1_CHAIN_ID),
        });

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
      } finally {
        await client.switchChain({
          id: Number(import.meta.env.VITE_L2_CHAIN_ID),
        });
      }
    },
    [client],
  );
  return { claimWithdraw: !client ? undefined : claimWithdraw };
};

export const useClaimProof = (txHash: `0x${string}`) => {
  const client = usePublicClient();
  const [proof, setProof] = useState<WithdrawalProof | undefined>();

  const waitWithdrawalProof = async (
    client: PublicClient,
    txHash: `0x${string}`,
  ): Promise<WithdrawalProof> => {
    try {
      const result = await getWithdrawalProof(client, txHash);
      return result;
    } catch (error) {
      console.log(
        "Withdrawal proof not available yet, retrying in 5 seconds...",
      );
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      const result = await waitWithdrawalProof(client, txHash);
      return result;
    }
  };

  useEffect(() => {
    if (!client) return;
    waitWithdrawalProof(client, txHash).then(setProof);
  }, [client, txHash]);

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
