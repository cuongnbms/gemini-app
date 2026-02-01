# Gemini Desktop App

A minimal Electron wrapper for [Google Gemini](https://gemini.google.com/).

## Features

- Native desktop app experience
- Persistent login sessions
- Full-width chat display
- Keyboard shortcuts for quick mode switching
- Multi-window support

## Installation

```bash
npm install
```

## Usage

```bash
# Run the app
make start

# Or
npm start
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+N` | Open new window |
| `Cmd+1` | Switch to Fast mode |
| `Cmd+2` | Switch to Thinking mode |
| `Cmd+3` | Switch to Pro mode |

> On Windows/Linux, use `Ctrl` instead of `Cmd`

## Build

```bash
# Build for current platform
make build

# Build for specific platform
make build-mac
make build-win
make build-linux
```

Built apps will be in the `dist/` folder.

## License

MIT
