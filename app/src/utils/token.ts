import { privateKeyToAccount } from "viem/accounts";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "viem/actions";
import Delegation from "../../../contracts/out/Delegation.sol/Delegation.json";
import TestToken from "../../../contracts/out/TestToken.sol/TestToken.json";
import {
  type TransactionReceipt,
  type Address,
  keccak256,
  encodePacked,
  slice,
  encodeFunctionData,
} from "viem";
import { type Client } from "../config/Web3Provider";
import { sign } from "webauthn-p256";

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

export const transferToken = async (
  client: Client,
  from: Address,
  to: Address,
  amount: bigint,
  credentialId: string,
): Promise<TransactionReceipt> => {
  const sender = privateKeyToAccount(
    import.meta.env.VITE_ETHREX_RICH_WALLET_PK,
  );

  const nonce = (await readContract(client, {
    abi: Delegation.abi,
    address: from,
    functionName: "nonce",
  })) as bigint;

  const calldata = encodeFunctionData({
    abi: TestToken.abi,
    functionName: "transfer",
    args: [to, amount],
  });

  const digest = keccak256(
    encodePacked(
      ["uint256", "address", "uint256", "bytes"],
      [nonce, import.meta.env.VITE_TEST_TOKEN_CONTRACT_ADDRESS, 0n, calldata],
    ),
  );

  const { signature, webauthn } = await sign({
    hash: digest,
    credentialId: credentialId,
  });

  const r = BigInt(slice(signature, 0, 32));
  const s = BigInt(slice(signature, 32, 64));

  const hash = await writeContract(client, {
    abi: Delegation.abi,
    address: from,
    functionName: "execute",
    args: [
      import.meta.env.VITE_TEST_TOKEN_CONTRACT_ADDRESS,
      0n,
      calldata,
      { r, s },
      webauthn,
    ],
    account: sender,
  });

  return await waitForTransactionReceipt(client, { hash });
};
