export let Config = {
    l1ChainId: null,
    l1BridgeAddress: null,
    // TODO: check whether it is possible to include these values in the :5555/health endpoint
    l2ChainId: 65536999,
    l2BridgeAddress: "0x000000000000000000000000000000000000ffff",
    // TODO: update these values with the right ones
    delegationContractAddress: "0x4417092B70a3E5f10Dc504d0947DD256B965fc62",
    testTokenContractAddress: "0x4B8a3d616d9146D9Ec66A33B76d63612eABEDE02",
    async load() {
        const res = await fetch("/internal-api/health");
        const data = await res.json();
        console.log("data: ", data);
        this.l1ChainId = await data["l1_proof_sender"]["l1_chain_id"];
        this.l1BridgeAddress = await data["l1_watcher"]["bridge_address"];
    }
};

/*

VITE_L1_NAME="Ethrex L1 Local"
VITE_L1_RPC_URL=http://host.docker.internal:8545
VITE_L1_CHAIN_ID=9
VITE_L1_BRIDGE_ADDRESS=0xebc31Eff9D9f5F63F65A68734816b7De1256845B
VITE_L2_NAME="Ethrex L2 Local"
VITE_L2_RPC_URL=http://host.docker.internal:1729
VITE_L2_CHAIN_ID=65536999
VITE_L2_BRIDGE_ADDRESS=0x000000000000000000000000000000000000ffff
VITE_WALLETCONNECT_PROJECT_ID=
VITE_DELEGATION_CONTRACT_ADDRESS=0x4417092B70a3E5f10Dc504d0947DD256B965fc62
VITE_TEST_TOKEN_CONTRACT_ADDRESS=0x4B8a3d616d9146D9Ec66A33B76d63612eABEDE02

*/
