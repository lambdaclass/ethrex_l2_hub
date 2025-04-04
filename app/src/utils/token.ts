import { privateKeyToAccount } from "viem/accounts";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "viem/actions";
import TestToken from "../../../contracts/out/TestToken.sol/TestToken.json";
import { type TransactionReceipt, type Address } from "viem";
import { type Client } from "../config/Web3Provider";

export const mintToken = async (
  client: Client,
  to: Address,
  amount: bigint,
): Promise<TransactionReceipt> => {
  const sender = privateKeyToAccount(
    import.meta.env.VITE_ETHREX_RICH_WALLET_PK,
  );
  const hash = await writeContract(client, {
    abi: TestToken.abi,
    address: import.meta.env.VITE_TEST_TOKEN_CONTRACT_ADDRESS,
    functionName: "transfer",
    args: [to, amount],
    account: sender,
  });

  return await waitForTransactionReceipt(client, { hash });
};

export const getTokenBalance = async (
  client: Client,
  address: Address,
): Promise<bigint> => {
  return (await readContract(client, {
    abi: TestToken.abi,
    address: import.meta.env.VITE_TEST_TOKEN_CONTRACT_ADDRESS,
    functionName: "balanceOf",
    args: [address],
  })) as bigint;
};
