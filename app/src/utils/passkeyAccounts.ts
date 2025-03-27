import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { type PublicKey, createCredential, parsePublicKey, sign } from 'webauthn-p256'
import { type Client, queryClient } from '../config/Web3Provider';
import { encodePacked, hexToBytes, keccak256, parseSignature } from 'viem';
import { signAuthorization } from 'viem/experimental';

export const newAccount = async ({ client }: { client: Client }) => {

  const account = privateKeyToAccount(generatePrivateKey())
  const initial_nonce = 0n


  const credential = await createCredential({
    user: {
      name: `Ethrex passkey for (${account.address})`,
      id: hexToBytes(account.address),
    },
  })

  const { x: pK_x, y: pK_y } = parsePublicKey(credential.publicKey)

  const digest = keccak256(
    encodePacked(
      ['uint256', 'uint256', 'uint256'],
      [initial_nonce, pK_x, pK_y],
    ),
  )

  const signature = parseSignature(await account.sign({ hash: digest }))

  const authorization = await signAuthorization(client, {
    account,
    contractAddress: "0x",
    delegate: true,
  })




}
