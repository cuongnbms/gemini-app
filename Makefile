.PHONY: install start dev build build-mac build-win build-linux clean

# Install dependencies
install:
	npm install

# Run the app
start:
	npm start

# Alias for start
dev: start

# Build for current platform
build:
	npm run build

# Build for macOS
build-mac:
	npm run build:mac

# Build for Windows
build-win:
	npm run build:win

# Build for Linux
build-linux:
	npm run build:linux

# Clean build artifacts and dependencies
clean:
	rm -rf dist node_modules

# Reinstall dependencies
reinstall: clean install
