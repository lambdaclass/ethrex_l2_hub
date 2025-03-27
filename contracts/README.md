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
