export ALICE_ADDRESS=0x94126D6C1DF257C4ADB7d281ccdC0637Efc02e01
export ALICE_PK=0xa57a0e0d64d0260ec0f16b4407ee27623e55ee4c7c1e5fd5e9331a57a35b462d
export BOB_ADDRESS=0x74cF0E6f896395F037484CB4899CFF0Ee6A9808c
export RICH_ACCOUNT_PK=0xbcdf20249abf0ed6d944c0288fad489e33f66b3960d9e6229c1cd214ed3bbe31
export ETH_RPC_URL=http://localhost:1729

forge create --private-key $RICH_ACCOUNT_PK --broadcast Delegation
sleep 5
forge create --private-key $RICH_ACCOUNT_PK --broadcast TestToken --constructor-args $ALICE_ADDRESS
sleep 5

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
            "nonce": '$(cast nonce $ALICE_ADDRESS)',
            "r": "'0x${AUTH_SIGNATURE:2:64}'",
            "s": "'0x${AUTH_SIGNATURE:66:64}'",
            "yParity": "'0x0$((0x${AUTH_SIGNATURE:130:2}-27))'"
        }]
    }]
  }'
sleep 10

# Check the delegation and authorization. It should return (P256_PUBKEY_X,P256_PUBKEY_Y)
echo "The following line should be ($P256_PUBKEY_X,$P256_PUBKEY_Y)"
cast call $ALICE_ADDRESS 'authorizedKey()((uint256,uint256))'

# Transfer TestToken from ALICE to BOB
echo "Paying with $RICH_ACCOUNT_PK"
cast send --private-key $RICH_ACCOUNT_PK $ALICE_ADDRESS 'execute(address,uint256,bytes,(uint256,uint256),(bytes,string,uint16,uint16,bool))' 0x17435ccE3d1B4fA2e5f8A08eD921D57C6762A180 0 $(cast calldata 'transfer(address,uint256)' $BOB_ADDRESS 100000000000000000) "($P256_PUBKEY_X, $P256_PUBKEY_Y)" '(0x,"",0,0,false)'
sleep 5

echo "Using sponsor"
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
