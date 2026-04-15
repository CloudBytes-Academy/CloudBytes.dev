ROOT := $(CURDIR)
WEB_DIR := $(ROOT)/web
WEB_DIST := $(WEB_DIR)/dist

NODE ?= node
NPM ?= npm
FIREBASE ?= firebase

.DEFAULT_GOAL := help

help:
	@echo ''
	@echo 'CloudBytes.dev (Astro) — Make targets'
	@echo ''
	@echo 'Local dev'
	@echo '  make dev            Run Astro dev server (direct, usually http://localhost:4321)'
	@echo '  make emulate         Serve built assets via Firebase emulator (http://localhost:8080)'
	@echo ''
	@echo 'Build / test'
	@echo '  make install         Install web/ dependencies (npm ci)'
	@echo '  make build           Build Astro site into web/dist'
	@echo '  make test            Build then run Vitest (tests assume web/dist exists)'
	@echo '  make algolia-index    Push records to Algolia (requires ALGOLIA_ADMIN_API_KEY)'
	@echo ''
	@echo 'Utilities'
	@echo '  make clean           Remove web/dist'
	@echo '  make format          Run Prettier on web/src'
	@echo '  make link-content    Create root symlinks: ./content -> web/src/content, ./images -> web/public/images'
	@echo ''
	@echo 'Cursor skills'
	@echo '  make skills          List external skills or install one with INSTALL=<sorted number>'
	@echo ''

.PHONY: install
install:
	cd "$(WEB_DIR)" && $(NPM) ci

.PHONY: build
build:
	cd "$(WEB_DIR)" && $(NPM) run build

.PHONY: test
test:
	cd "$(WEB_DIR)" && $(NPM) run build && $(NPM) test

.PHONY: algolia-index
algolia-index:
	cd "$(WEB_DIR)" && $(NODE) scripts/algolia-index.mjs

.PHONY: clean
clean:
	rm -rf "$(WEB_DIST)"

.PHONY: format
format:
	cd "$(WEB_DIR)" && npx prettier --write src

.PHONY: emulate firebase
emulate:
	$(FIREBASE) emulators:start --only hosting

firebase: emulate

.PHONY: dev
dev:
	cd "$(WEB_DIR)" && $(NPM) run dev

.PHONY: link-content
link-content:
	@set -e; \
	if [ -e "content" ] && [ ! -L "content" ]; then echo "Refusing: ./content exists and is not a symlink"; exit 1; fi; \
	if [ -e "images" ] && [ ! -L "images" ]; then echo "Refusing: ./images exists and is not a symlink"; exit 1; fi; \
	mkdir -p "web/public/images"; \
	ln -sfn "web/src/content" "content"; \
	ln -sfn "web/public/images" "images"; \
	echo "Linked ./content -> web/src/content"; \
	echo "Linked ./images  -> web/public/images"

.PHONY: skills
skills: ## List external skills or install one with INSTALL=<sorted number>
	@./.scripts/manage-skills.sh $(if $(INSTALL),install "$(INSTALL)",list)
	@if [ -n "$(INSTALL)" ]; then \
		mkdir -p .claude; \
		ln -sfn "$(abspath .agents/skills)" .claude/skills; \
		ln -sf "$(abspath AGENTS.md)" CLAUDE.md; \
		echo "Skills installed"; \
	fi