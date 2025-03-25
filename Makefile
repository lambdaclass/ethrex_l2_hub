
.PHONY: deploy run start

#Run Ethrex
run-back:

#Deploy contracts
deploy:

#Run Hub front app
run-front:
	cd app && \
	npm install &&\
	npm run dev


start: 
	run-back
	deploy
	run-font
