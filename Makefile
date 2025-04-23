
.PHONY: deploy run start

#Run Ethrex
run-back:

#Deploy contracts
deploy:
	cd contracts && \
	forge create Delegation --private-key "e4f7dc8b199fdaac6693c9c412ea68aed9e1584d193e1c3478d30a6f01f26057"  --broadcast --rpc-url http://127.0.0.1:1729 && \
	sleep 10 && \
	forge create TestToken --private-key "e4f7dc8b199fdaac6693c9c412ea68aed9e1584d193e1c3478d30a6f01f26057"  --broadcast --rpc-url http://127.0.0.1:1729

#Run Hub front app
run-front:
	cd app && \
	npm install &&\
	npm run dev


start: 
	run-back
	deploy
	run-font
