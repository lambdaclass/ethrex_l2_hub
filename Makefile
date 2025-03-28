
.PHONY: deploy run start

#Run Ethrex
run-back:

#Deploy contracts
deploy:
	cd contracts && \
	forge create Delegation --private-key "e4f7dc8b199fdaac6693c9c412ea68aed9e1584d193e1c3478d30a6f01f26057" --broadcast

#Run Hub front app
run-front:
	cd app && \
	npm install &&\
	npm run dev


start: 
	run-back
	deploy
	run-font
