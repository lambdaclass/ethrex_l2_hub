// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ECDSA} from "./lib/ECDSA.sol";
import {WebAuthnP256} from "./lib/WebAuthnP256.sol";

contract Delegation {
    event Authorized(ECDSA.PublicKey indexed authorized);
    event Executed(address indexed to, uint256 value, bytes data);

    uint256 public nonce;
    ECDSA.PublicKey public authorizedKey;

    /// Authorize a public key to execute transactions on behalf of the delegatee
    /// @param authorized The public key to authorize
    /// @param signature The Ethereum signature to verify the authorization
    function authorize(ECDSA.PublicKey calldata authorized, ECDSA.RecoveredSignature calldata signature) public {
        bytes32 digest = keccak256(abi.encodePacked(nonce, authorized.x, authorized.y));
        nonce++;

        address signer = ecrecover(
            digest,
            signature.yParity == 0 ? 27 : 28,
            bytes32(signature.r),
            bytes32(signature.s)
        );

        if (signer != address(this)) {
            revert("Unauthorized");
        }

        authorizedKey = authorized;

        emit Authorized(authorized);
    }

    /// Execute a transaction on behalf of the delegatee
    /// @param to The address of the contract to call
    /// @param value The amount of ether to send
    /// @param data The calldata to send
    function execute(address to, uint256 value, bytes calldata data, ECDSA.Signature calldata signature, WebAuthnP256.Metadata calldata metadata) public {
        bytes32 challenge = keccak256(abi.encodePacked(nonce, to, value, data));
        nonce++;

        if (!WebAuthnP256.verify(challenge, metadata, signature, authorizedKey)) {
            revert("Invalid signature");
        }

        (bool success,) = to.call{value: value}(data);
        require(success, "Call failed");

        emit Executed(to, value, data);
    }

    receive() external payable {}
}
