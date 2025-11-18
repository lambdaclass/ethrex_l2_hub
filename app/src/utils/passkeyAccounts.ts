import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { createCredential, parsePublicKey, sign } from "webauthn-p256";
import { type Client } from "../config/passkey_config";
import {
  bytesToHex,
  encodePacked,
  type Hex,
  hexToBytes,
  keccak256,
  parseSignature,
} from "viem";
import { signAuthorization } from "viem/experimental";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "viem/actions";
import Delegation from "../../abi/Delegation.json";

export const signUp = async ({
  client,
  username,
}: {
  client: Client;
  username: string;
}) => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const initial_nonce = 0n;

  const credential = await createCredential({
    user: {
      name: `Ethrex ${username}`,
      id: hexToBytes(account.address),
    },
  });

  const publicKey = parsePublicKey(credential.publicKey);

  const digest = keccak256(
    encodePacked(
      ["uint256", "uint256", "uint256"],
      [initial_nonce, publicKey.x, publicKey.y]
    )
  );

  const signature = parseSignature(await account.sign({ hash: digest }));

  const authorization = await signAuthorization(client, {
    account,
    contractAddress: import.meta.env.VITE_DELEGATION_CONTRACT_ADDRESS,
    delegate: true,
  });

  const hash = await writeContract(client, {
    abi: Delegation.abi,
    address: account.address,
    functionName: "authorize",
    args: [
      {
        x: publicKey.x,
        y: publicKey.y,
      },
      {
        r: BigInt(signature.r),
        s: BigInt(signature.s),
        yParity: signature.yParity,
      },
    ],
    authorizationList: [authorization],
    gas: 124000n, // This is a temporary fix while gas estimate is fixed in ethrex
    account: null,
  });

  const receipt = await waitForTransactionReceipt(client, { hash });

  return {
    address: account.address,
    credential,
    receipt,
  };
};

export const login = async ({ client }: { client: Client }) => {
  const { raw } = await sign({
    hash: "0x",
  });

  const response = raw.response as AuthenticatorAssertionResponse;
  const address = bytesToHex(new Uint8Array(response.userHandle!));

  const [publicKeyX, publicKeyY] = (await readContract(client, {
    address,
    abi: Delegation.abi,
    functionName: "authorizedKey",
  })) as [bigint, bigint];

  return {
    address,
    credential: {
      id: raw.id,
      publicKey: `0x${publicKeyX.toString(16)}${publicKeyY.toString(
        16
      )}` as Hex,
      raw,
    },
  };
};
