
.PHONY: deploy run start

#Run Ethrex
run-back:

#Deploy contracts
deploy:
	rex deploy --contract-path contracts/src/Delegation.sol 0 0x941e103320615d394a55708be13e45994c7d93b932b064dbcb2b511fe3254e2e --remappings "@solady=https://github.com/Vectorized/solady" --keep-deps --rpc-url http://localhost:1729
	rex deploy --contract-path contracts/src/TestToken.sol 0 0x941e103320615d394a55708be13e45994c7d93b932b064dbcb2b511fe3254e2e --remappings "@openzeppelin=https://github.com/OpenZeppelin/openzeppelin-contracts.git" --keep-deps --rpc-url http://localhost:1729
	mv solc_out/Delegation.abi solc_out/Delegation.json
	mv solc_out/TestToken.abi solc_out/TestToken.json

#Run Hub front app
run-front:
	cd app && \
	npm install &&\
	npm run dev


start: 
	run-back
	deploy
	run-font
