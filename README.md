# Ethrex L2 Hub

## Overview  
This is a frontend application built with React that connects a Web3 wallet to a L2 blockchain running **Ethrex L2**. The app allows users to:  
- Connect their Web3 wallet  
- Use the bridge to transfer and withdraw funds  
- Interact with the Ethrex Rollup chain  

## Features  
✅ Web3 wallet connection  
✅ Bridge for transferring and withdrawing funds  

## Installation  

### Prerequisites  
- **Node.js** (v21+ recommended)  
- **npm**  

### Setup  
```bash
# run your ethrex l2 mode (in your ethrex local directory)
cd [your_ethrex_path]/crates/l2
git checkout test_sponsor
make restart

# Create enviroment file for the frontend app
cp app/.env.example app/.env

# Deploy contracts
make deploy

# Set enviroment for app
set the the VITE_DELEGATION_CONTRACT_ADDRESS in app/.env with the address from the previous command

# Run the frontend app
make run-front  
```

## Usage  
1. Open the app in your browser.  
2. Connect your Web3 wallet (MetaMask, WalletConnect, etc.).  
3. Use the bridge to transfer or withdraw funds on **Ethrex Rollup**.  

## Configuration  
If needed, update the RPC URLs and contract addresses in the environment variables or configuration files.  

## Contributing  
Feel free to submit pull requests or open issues for bug fixes and feature suggestions.  

## References and acknowledgements
The following links, repos, companies and projects have been important in the development of this repo, we have learned a lot from them and want to thank and acknowledge them.

[Ithaca  Account Delegation with EIP-7702](https://github.com/ithacaxyz/exp-0001)
[EIP-7212: Precompiled for secp256r1 Curve Support](https://ethereum-magicians.org/t/eip-7212-precompiled-for-secp256r1-curve-support/14789)
[dopewars] (https://dopewars.game/)

## License  
MIT  
