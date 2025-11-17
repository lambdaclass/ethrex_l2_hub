# Ethrex L2 Hub contracts

## Requirements

- `rex` from [ethrex](https://github.com/lambdaclass/rex)
- `cast` from [foundry](https://github.com/foundry-rs/foundry)


## Contracts

The project consists in the following contracts:

- `Delegation`: This is a simple delegation contract that is aimed to be used by EOA to delegate their account. This contract allows users to authorize a single P256 public key to execute transactions on their behalf.
- `TestToken`: This is an example OpenZeppelin ERC-20 token to test functionalities.

## Deploy

We will declare some addresses and PKs:

```bash
export ALICE_ADDRESS=0x94126D6C1DF257C4ADB7d281ccdC0637Efc02e01
export ALICE_PK=0xa57a0e0d64d0260ec0f16b4407ee27623e55ee4c7c1e5fd5e9331a57a35b462d
export BOB_ADDRESS=0x74cF0E6f896395F037484CB4899CFF0Ee6A9808c
export RICH_ACCOUNT_PK=0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31
```

To deploy the contracts, you can follow this steps:

- In another terminal, start an ethrex L2 dev. You can do this by running the following command in the root directory of the [ethrex GitHub repository](https://github.com/lambdaclass/ethrex/):

    ```bash
    `COMPILE_CONTRACTS=true cargo run --release --bin ethrex --features l2,l2-sql` -- l2 --dev --no-monitor
    ```
- Be sure to have the `ETH_RPC_URL` env var set to the L2 RPC URL, e.g.: `export ETH_RPC_URL=http://localhost:1729`.
- Once you have the L1 and L2 running, to deploy the contracts run the following in the root directory of this repository:

    ```bash
    make deploy
    ```

## Delegate an EOA

> [!WARNING]
> WIP. P256 stuff are not tested yet

We will delegate the previous account to the `Delegation` contract. In the same transaction, we can authorize a P256 public key.

```bash
# First fund ALICE. Alice needs to send the transaction where she will delegate her account
cast send --private-key $RICH_ACCOUNT_PK --value 1000000000000000000 $ALICE_ADDRESS
# Sign the delegation. As we will send the transaction from ALICE, her nonce will be increased BEFORE processing the transaction and the authorization
SIGNED_AUTH=$(cast wallet sign-auth 0xb4B46bdAA835F8E4b4d8e208B6559cD267851051 --private-key $ALICE_PK --nonce 1)
# Delegate and authorize a P256 public key
cast send --private-key $ALICE_PK --auth $SIGNED_AUTH $ALICE_ADDRESS 'authorize((uint256,uint256))' '(<P256_PUBLIC_X>, <P256_PUBLIC_Y>)'
```

Then, you can test the delegation sending a transaction signed with the P256 private key. This transaction will send some `TestToken`s to `BOB_ADDRESS`:

```bash
cast send --private-key $RICH_ACCOUNT_PK $ALICE_ADDRESS 'execute(address,uint256,bytes,(uint256,uint256),(bytes,string,uint16,uint16,bool))' 0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180 0 $(cast calldata 'transfer(address,uint256)' $BOB_ADDRESS 100000000000000000) '(<P256_SIG_X>, <P256_SIG_Y>)' '(WebAuthnP256.Metadata)'
```
