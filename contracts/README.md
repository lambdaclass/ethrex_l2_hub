## Ethrex L2 HUB contracts

### Requirements

- `forge`

### Dependencies

To install all dependencies run:

```bash
forge install OpenZeppelin/openzeppelin-contracts --no-commit --no-git
forge install vectorized/solady --no-commit --no-git
```

### Contracts

The project consists in the following contracts:

- `Delegation`: This is a simple delegation contract that is aimed to be used by EOA to delegate their account. This contract allows users to authorize a single P256 public key to execute transactions on their behalf.
- `TestToken`: This is an example OpenZeppelin ERC-20 token to test functionalities.

### Deploy

You can test the whole deploy + delegate process using the script in `test/sponsor.sh`. Please note that the steps are not idempotent. These are the detailed steps:

We will declare some addresses and PKs:

```bash
export ALICE_ADDRESS=0x94126D6C1DF257C4ADB7d281ccdC0637Efc02e01
export ALICE_PK=0xa57a0e0d64d0260ec0f16b4407ee27623e55ee4c7c1e5fd5e9331a57a35b462d
export BOB_ADDRESS=0x74cF0E6f896395F037484CB4899CFF0Ee6A9808c
export RICH_ACCOUNT_PK=0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31
```

To deploy the contracts, you can follow this steps:

- In another terminal, start an Ethrex L2 blockchain. You can do this by running `make restart` in the `crates/l2` directory of the Ethrex repo. Make sure to set the sponsor flags `--sponsorable-addresses` and `--sponsor-private-key`. The address `0xb4B46bdAA835F8E4b4d8e208B6559cD267851051` has to be in the `--sponsorable-addresses` list.
- Be sure to have the `ETH_RPC_URL` env var set to the L2 RPC URL, e.g.: `export ETH_RPC_URL=http://localhost:1729`.
- Deploy the delegation contract with `forge create --private-key $RICH_ACCOUNT_PK --broadcast Delegation`. The deployed address should be `0xb4B46bdAA835F8E4b4d8e208B6559cD267851051`.
- Deploy the test token with `forge create --private-key $RICH_ACCOUNT_PK --broadcast TestToken --constructor-args $ALICE_ADDRESS`. The deployed address should be `0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180`. This will also mint tokens for `ALICE_ADDRESS`

### Delegate an EOA

> [!WARNING]
> WIP. P256 stuff are not tested yet

We will delegate the previous account to the `Delegation` contract. In the same transaction, we can authorize a P256 public key.

```bash
# P256 public key
export P256_PUBKEY_X=1
export P256_PUBKEY_Y=2

# Sign the delegation
export AUTH_DIGEST_HASH=$(cast keccak 0x05$(cast to-rlp '[1729, "0xb4B46bdAA835F8E4b4d8e208B6559cD267851051", 0]' | cut -dx -f2))
export AUTH_SIGNATURE=$(cast wallet sign --private-key $ALICE_PK --no-hash $AUTH_DIGEST_HASH)

# Sign the authorize request
export CALLDATA_DIGEST_HASH=$(cast keccak $(cast abi-encode --packed '_(uint256,uint256,uint256)' 0 $P256_PUBKEY_X $P256_PUBKEY_Y))
export CALLDATA_SIGNATURE=$(cast wallet sign --private-key $ALICE_PK --no-hash $CALLDATA_DIGEST_HASH)

# Delegate and authorize the P256 public key
curl $ETH_RPC_URL -H 'content-type: application/json' \
    --data '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "ethrex_sendTransaction",
    "params": [{
        "to": "'$ALICE_ADDRESS'",
        "data": "'$(\
            cast calldata "authorize((uint256,uint256),(uint256,uint256,uint8))" \
            "($P256_PUBKEY_X,$P256_PUBKEY_Y)" \
            "(0x${CALLDATA_SIGNATURE:2:64},0x${CALLDATA_SIGNATURE:66:64},0x$((0x${CALLDATA_SIGNATURE:130:2}-27)))"\
          )'",
        "authorizationList": [{
            "address": "0xb4B46bdAA835F8E4b4d8e208B6559cD267851051",
            "chainId": "1729",
            "nonce": 0,
            "r": "'0x${AUTH_SIGNATURE:2:64}'",
            "s": "'0x${AUTH_SIGNATURE:66:64}'",
            "yParity": "'0x0$((0x${AUTH_SIGNATURE:130:2}-27))'"
        }]
    }]
  }'

# Check the delegation and authorization. It should return (P256_PUBKEY_X,P256_PUBKEY_Y)
cast call $ALICE_ADDRESS 'authorizedKey()((uint256,uint256))'
```

Then, you can test the delegation sending a transaction signed with the P256 private key. This transaction will send some `TestToken`s to `BOB_ADDRESS`:

```bash
# Paying with $RICH_ACCOUNT_PK
cast send --private-key $RICH_ACCOUNT_PK $ALICE_ADDRESS 'execute(address,uint256,bytes,(uint256,uint256),(bytes,string,uint16,uint16,bool))' 0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180 $(cast call $ALICE_ADDRESS 'nonce()(uint256)') $(cast calldata 'transfer(address,uint256)' $BOB_ADDRESS 100000000000000000) "($P256_PUBKEY_X, $P256_PUBKEY_Y)" '(<WebAuthnP256.Metadata>)'

# With sponsor
export CALLDATA_DIGEST_HASH=$(cast keccak $(cast abi-encode --packed '_(uint256,address,uint256,bytes)' $(cast call $ALICE_ADDRESS 'nonce()(uint256)') 0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180 0 $(cast calldata 'transfer(address,uint256)' $BOB_ADDRESS 100000000000000000)))
curl $ETH_RPC_URL -H 'content-type: application/json' \
    --data '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "ethrex_sendTransaction",
    "params": [{
        "to": "'$ALICE_ADDRESS'",
        "data": "'$(\
            cast calldata "execute(address,uint256,bytes,(uint256,uint256),(bytes,string,uint16,uint16,bool))" \
            0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180 0 $(cast calldata 'transfer(address,uint256)' $BOB_ADDRESS 100000000000000000) \
            '(0,0)' '(0x,"",0,0,false)' \
            )'"
    }]
  }'
```

Check the ERC20 balance of `BOB_ADDRESS`:

```bash
cast balance --erc20 0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180 $BOB_ADDRESS
```
