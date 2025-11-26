# Ethrex L2 Hub

## Overview

A full-stack demonstration of **Ethrex L2**, showcasing a Layer 2 rollup solution with bridge capabilities and account abstraction features. This React-based frontend allows users to:

- Bridge assets between L1 and L2 (deposit, withdraw, claim)
- Use Account Abstraction to mint and transfer tokens with passkey authentication (fingerprint/biometrics)
- Interact with Ethrex Rollup without complex wallet management

## Prerequisites

Before starting, ensure you have the following installed:

- Node.js v21+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- Solc - v0.8.29
- Rex - Utility tool for debugging and interacting with Ethereum. Install [here](https://github.com/lambdaclass/rex?tab=readme-ov-file#installing-the-cli)

## Setup and Deployment

Follow these steps to get the entire system running.

### Phase 1: Ethrex Setup

1. Clone [ethrex](https://github.com/lambdaclass/ethrex)

```bash
git clone https://github.com/lambdaclass/ethrex.git && cd ethrex
```

2. Checkout the branch required for this project

<!--- FIXME: Remove this once https://github.com/lambdaclass/ethrex/pull/5339 is merged --->

```bash
git checkout test_sponsor
```

3. Build ethrex

```bash
export COMPILE_CONTRACTS=true && cargo build --bin ethrex --release --manifest-path Cargo.toml --features l2,l2-sql
```

3. Start L1 and L2

This command will:

- Start the L1 on port 8545
- Deploy L1 contracts (Bridge, OnChainProposer, Verifier)
- Start the L2 on port 1729

If you want to use the account abstraction feature, you need to create a txt file with the addresses of the contract you want to sponsor.
You

```bash
target/release/ethrex l2 --dev --no-monitor --sponsorable-addresses <YOUR_SPONSORABLE_ADDRESSES_FILE>
```

Wait for the chains to fully initialize. You should see logs indicating both L1 (port 8545) and L2 (port 1729) are running. The deployment will also fund test accounts with ETH.

4. Initialize the Prover

In a new terminal window, run:

```bash
./ethrex l2 prover --backend exec --proof-coordinators tcp://127.0.0.1:3900
```

Keep this terminal running. The prover must stay active for the L2 to function properly. Without it, withdrawals cannot be finalized.

### Phase 2: Deploy the Hub App

5. Configure environment variables

In another terminal window, in the root of the project, run:

```bash
cp app/.env.example app/.env
```

7. Deploy smart contracts

> [!IMPORTANT]
> Running the following command requires a rex version that supports compiling contracts and outputting JSON ABI files. To install this version run the following commands:
>
> ```bash
> git clone https://github.com/lambdaclass/rex.git
> cd rex
> git checkout add_abi_json_flag
> make cli
> ```

This deploys two contracts to the L2:

- `Delegation`: Enables account abstraction with passkey authentication
- `TestToken`: ERC-20 token for testing transfers

```bash
make deploy
```

After deployment, you'll see output with contract addresses. Copy these addresses:

```
Deployed Delegation to: 0x...
Deployed TestToken to: 0x...
```

8. Update environment variables

Edit `app/.env` and update the following variables with the addresses from step 7:

```bash
VITE_DELEGATION_CONTRACT_ADDRESS=0x... # Address from Delegation deployment
VITE_TEST_TOKEN_CONTRACT_ADDRESS=0x... # Address from TestToken deployment
```

9. Run the frontend

The app should now be running at `http://localhost:5173`

```bash
make run-front
```

## Running with Docker

Pull the image from the registry with

```bash
docker pull ghcr.io/lambdaclass/ethrex_l2_hub:merge
```

Run the image with

```bash
docker run --name ethrex_l2_hub -p 5173:5173 --env-file /path/to/.env ghcr.io/lambdaclass/ethrex_l2_hub:merge
```

The `.env` file must contain the following environment variables (make sure to replace them with the actual values)

```.env
VITE_L1_NAME="Ethrex L1 Local"
VITE_L1_RPC_URL=http://host.docker.internal:8545
VITE_L1_CHAIN_ID=9
VITE_HEALTH_ENDPOINT=http://host.docker.internal:5555
VITE_L2_NAME="Ethrex L2 Local"
VITE_L2_RPC_URL=http://host.docker.internal:1729
VITE_L2_CHAIN_ID=65536999
VITE_L2_BRIDGE_ADDRESS=0x000000000000000000000000000000000000ffff
VITE_WALLETCONNECT_PROJECT_ID=
VITE_DELEGATION_CONTRACT_ADDRESS=0x00e29d532f1c62a923ee51ee439bfc1500b1ce4d
VITE_TEST_TOKEN_CONTRACT_ADDRESS=0x4b8a3d616d9146d9ec66a33b76d63612eabede02

```

**Environment Variable Notes:**

- **`VITE_HEALTH_ENDPOINT`**: URL to the ethrex node's health endpoint

  - **Local development**: Can be omitted (defaults to `http://localhost:5555`) or set explicitly
  - **Docker**: Use `http://host.docker.internal:5555` to access the host's ethrex node from within the container
  - The Vite dev server proxies requests to avoid CORS issues

- **`VITE_L1_BRIDGE_ADDRESS`**: No longer required. The L1 bridge address is now dynamically fetched from the ethrex node's health endpoint at startup. The app will retry until the bridge contract is deployed and available.

## Features

### L1 ↔ L2 Bridge

Transfer assets between the L1 and L2 chains:

- Deposit: Move ETH from L1 to L2 for faster and cheaper transactions
- Withdraw: Initiate a withdrawal from L2 back to L1
- Claim: Finalize and claim your withdrawal on L1 (after proof generation)

The bridge ensures secure asset transfers by locking funds on one chain and minting/releasing them on the other.

### Account Abstraction with Passkeys

Experience transactions using biometric authentication:

- Mint Tokens: Create tokens on L2 using your device's fingerprint or Face ID
- Transfer Tokens: Send tokens to other addresses without traditional wallet signatures
- Passkey Authentication: Uses WebAuthn (device biometrics) instead of private keys

This feature leverages:

- [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702): Account delegation for enabling smart contract functionality on EOAs
- [RIP-7212](https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7212.md): secp256r1 curve precompile for efficient passkey signature verification

## Usage

### Connecting Your Wallet

1. Open the app in your browser (`http://localhost:5173`)
2. Click `Connect Wallet`
3. Approve the connection in MetaMask or your preferred Web3 wallet

### Using the Bridge

**To Deposit (L1 → L2)**:

> [!NOTE]
> You will need to have some ETH in your L1 wallet to be able to deposit. You can use the rich account to transfer ETH to your wallet.
> `rex send 0xb9d9ede845d349369eef96ef8e853b2cda387d88 --value 100000000000000000000 --private-key 0x941e103320615d394a55708be13e45994c7d93b932b064dbcb2b511fe3254e2e --rpc-url http://localhost:8545`
> This will transfer 100 ETH to your wallet.

1. Navigate to the `/bridge/deposit` page
2. Enter the amount of ETH to transfer
3. Confirm the transaction in your wallet
4. Wait for the transaction to be processed on both L1 and L2

**To Withdraw (L2 → L1)**:

1. Navigate to the `/bridge/withdraw` page
2. Enter the amount to withdraw
3. Submit the withdrawal request
4. Wait for the L2 block to be proven (Search for a)

**To Claim Withdrawal**:

1. After your withdrawal is proven, you will be able to claim it by clicking on the "Claim Withdrawal" button
2. Your funds will be released on L1

### Using Account Abstraction

> [!NOTE]
> You will need to add the `Delegation` address to a file in `ethrex/crates/l2/sponsorable.txt`.
> This allows the `Delegation` contract to sponsor transactions for you.

1. Navigate to the `/passkey_demo` page
2. Create Account: Click to create a new account with passkey authentication
   - You'll be prompted to use your device's biometric authentication
3. Mint Tokens: Enter an amount and mint tokens using your passkey
4. Transfer Tokens: Enter a recipient address and amount to transfer
   - No gas fees required! Transactions are sponsored by the `Delegation` contract

## Debugging with Rex

Rex is a CLI tool that helps you debug and interact with your L1 and L2 chains. Here are some useful commands:

<!--- FIXME: Check rex commands, i think some of these are not correct --->

```bash
# Check the transaction receipt for error details
rex receipt <DEPLOYMENT_TX_HASH> <RPC_URL>

# Check the code of a contract
rex code <CONTRACT_ADDRESS> <RPC_URL>

# Verify L2 is producing blocks
rex block-number <L2_RPC_URL>

# Check balance
rex balance <YOUR_ADDRESS> <RPC_URL>

```

## Contributing

Feel free to submit pull requests or open issues for bug fixes and feature suggestions.

## References and acknowledgements

The following links, repos, companies and projects have been important in the development of this repo, we have learned a lot from them and want to thank and acknowledge them.

- [Ithaca Account Delegation with EIP-7702](https://github.com/ithacaxyz/exp-0001)
- [EIP-7212: Precompiled for secp256r1 Curve Support](https://ethereum-magicians.org/t/eip-7212-precompiled-for-secp256r1-curve-support/14789)
- [Dopewars](https://dopewars.game/)

## License

MIT
