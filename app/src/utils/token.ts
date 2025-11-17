import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "viem/actions";
import Delegation from "../../../solc_out/Delegation.json";
import TestToken from "../../../solc_out/TestToken.json";
import {
  type TransactionReceipt,
  type Address,
  keccak256,
  encodePacked,
  slice,
  encodeFunctionData,
} from "viem";
import { type Client } from "../config/passkey_config";
import { sign } from "webauthn-p256";

export const mintToken = async (
  client: Client,
  to: Address,
  amount: bigint,
  credentialId: string,
): Promise<TransactionReceipt> => {
  const nonce = (await readContract(client, {
    abi: Delegation,
    address: to,
    functionName: "nonce",
  })) as bigint;

  const calldata = encodeFunctionData({
    abi: TestToken,
    functionName: "mint",
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
    abi: Delegation,
    address: to,
    functionName: "execute",
    args: [
      import.meta.env.VITE_TEST_TOKEN_CONTRACT_ADDRESS,
      0n,
      calldata,
      { r, s },
      webauthn,
    ],
    account: null,
  });

  return await waitForTransactionReceipt(client, { hash });
};

export const getTokenBalance = async (
  client: Client,
  address: Address,
): Promise<bigint> => {
  return (await readContract(client, {
    abi: TestToken,
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
  const nonce = (await readContract(client, {
    abi: Delegation,
    address: from,
    functionName: "nonce",
  })) as bigint;

  const calldata = encodeFunctionData({
    abi: TestToken,
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
    abi: Delegation,
    address: from,
    functionName: "execute",
    args: [
      import.meta.env.VITE_TEST_TOKEN_CONTRACT_ADDRESS,
      0n,
      calldata,
      { r, s },
      webauthn,
    ],
    account: null,
  });

  return await waitForTransactionReceipt(client, { hash });
};
