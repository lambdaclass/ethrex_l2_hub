import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { type PublicKey, createCredential, parsePublicKey, sign } from 'webauthn-p256'
import { type Client, queryClient } from '../config/Web3Provider';
import { encodePacked, hexToBytes, keccak256, parseSignature } from 'viem';
import { signAuthorization } from 'viem/experimental';
import { waitForTransactionReceipt, writeContract } from 'viem/actions';
import Delegation from '../../../contracts/out/Delegation.sol/Delegation.json';

export const newAccount = async ({ client, username }: { client: Client, username: string }) => {

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
    account,
    credential,
    receipt
  }
}
