import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { type PublicKey, createCredential, parsePublicKey, sign, serializePublicKey } from 'webauthn-p256'
import { type Client, queryClient } from '../config/Web3Provider';
import { bytesToHex, encodePacked, Hex, hexToBytes, keccak256, parseSignature, stringToHex } from 'viem';
import { signAuthorization } from 'viem/experimental';
import { readContract, waitForTransactionReceipt, writeContract } from 'viem/actions';
import Delegation from '../../../contracts/out/Delegation.sol/Delegation.json';

export const signUp = async ({ client, username }: { client: Client, username: string }) => {
  const account = privateKeyToAccount(generatePrivateKey())
  const sender = privateKeyToAccount(import.meta.env.VITE_ETHREX_RICH_WALLET_PK)
  const initial_nonce = 0n

  const credential = await createCredential({
    user: {
      name: `Ethrex ${username}`,
      id: hexToBytes(account.address),
    },
  })

  const publicKey = parsePublicKey(credential.publicKey)

  const digest = keccak256(
    encodePacked(
      ['uint256', 'uint256', 'uint256'],
      [initial_nonce, publicKey.x, publicKey.y],
    ),
  )

  const signature = parseSignature(await account.sign({ hash: digest }))

  const authorization = await signAuthorization(client, {
    account,
    contractAddress: import.meta.env.VITE_DELEGATION_CONTRACT_ADDRESS,
    delegate: true,
  })

  const hash = await writeContract(client, {
    abi: Delegation.abi,
    address: account.address,
    functionName: 'authorize',
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
    account: sender, // defer to sequencer to fill
  })

  const receipt = await waitForTransactionReceipt(client, { hash })

  return {
    address: account.address,
    credential,
    receipt
  }
}


export const login = async ({ client }: { client: Client }) => {

  const { raw } = await sign({
    hash: '0x',
  })

  const response = raw.response as AuthenticatorAssertionResponse
  const address = bytesToHex(new Uint8Array(response.userHandle!))

  console.log(address)

  const [publicKey] = await readContract(client, {
    address,
    abi: Delegation.abi,
    functionName: 'authorizedKey',
  }) as [PublicKey]

  console.log('publicKey', publicKey)
  console.log('credential', raw)

  return {
    address,
    credential: {
      id: raw.id,
      publicKey: serializePublicKey(publicKey),
      raw
    }
  }
}
