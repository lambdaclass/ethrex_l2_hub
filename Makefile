
.PHONY: deploy run start

#Run Ethrex
run-back:

#Deploy contracts
deploy:
	cd contracts && \
	forge create Delegation --private-key "941e103320615d394a55708be13e45994c7d93b932b064dbcb2b511fe3254e2e" --broadcast --rpc-url http://127.0.0.1:1729 --gas-price 5000000000 --gas-limit 5000000 && \
	sleep 10 && \
	forge create TestToken --private-key "941e103320615d394a55708be13e45994c7d93b932b064dbcb2b511fe3254e2e" --broadcast --rpc-url http://127.0.0.1:1729 --gas-price 5000000000 --gas-limit 5000000

#Run Hub front app
run-front:
	cd app && \
	npm install &&\
	npm run dev


start: 
	run-back
	deploy
	run-font
