ifneq (,$(wildcard .env))
    include .env
    export
endif

# Default target
.DEFAULT_GOAL := help

DOCKER_IMAGE ?= local/shopware/k6
SCRIPT ?= example.js
PARAMS ?= "--no-usage-report"

.PHONY: help
help:
	@echo "Available commands:"
	@echo "  build                  - Fetch fixtures and build a ready-to-use k6 Docker image"
	@echo "  build-without-fetch    - Build a ready-to-use k6 Docker image"
	@echo "  run                    - Run the build docker image, use SCRIPT and PARAMS to specify the test script and parameters"

.PHONY: build
build:
	@echo "Building k6 Docker image..."
	@docker buildx build \
	   -t $(DOCKER_IMAGE) \
		--secret id=SHOP_URL,env=SHOP_URL \
		--secret id=SHOP_ADMIN_USERNAME,env=SHOP_ADMIN_USERNAME \
		--secret id=SHOP_ADMIN_PASSWORD,env=SHOP_ADMIN_PASSWORD \
		--load \
		.
	@echo "Done!"
	@echo "To run the image, use:"
	@echo "  docker run -i -t $(DOCKER_IMAGE)"

.PHONY: build-without-fetch
build-without-fetch:
	@echo "Building k6 Docker image..."
	@docker buildx build \
	   -t $(DOCKER_IMAGE) \
		--secret id=SHOP_URL,env=SHOP_URL \
		--secret id=SHOP_ADMIN_USERNAME,env=SHOP_ADMIN_USERNAME \
		--secret id=SHOP_ADMIN_PASSWORD,env=SHOP_ADMIN_PASSWORD \
		--load \
		--target without-fetch \
		.
	@echo "Done!"
	@echo "To run the image, use:"
	@echo "  docker run -i -t $(DOCKER_IMAGE)"

.PHONY: run
run:
	@echo "Running k6 Docker image..."
	@docker run \
	    -it \
		-p 5665:5665 \
		-e K6_WEB_DASHBOARD=true \
	    -e K6_WEB_DASHBOARD_HOST=0.0.0.0 \
		$(DOCKER_IMAGE) \
		run $(SCRIPT) $(PARAMS)
