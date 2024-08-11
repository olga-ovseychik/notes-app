build-dev:
	cd client && "$(MAKE)" build-dev
	cd server && "$(MAKE)" build-dev

run-dev:
	docker-compose up

