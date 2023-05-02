# webrcade-feed-exporter 🕹️ 💾

**WIP 30% complete does not work end to end**

Create a webЯcade feed from LaunchBox metadata. This project assumes that your
game files, bios(es) and images are accessible via http(s), this is not covered
by this program. Currently, the following platforms are supported:

- Sega Genesis / Mega Drive
- Sega CD
- Super Nintendo Entertainment System
- Sony PlayStation

## Requirements

**Operating System**: Linux or macOS, Windows should work but has not been tested<br>
**Runtime:** Node 16+, npm

## Installation

Ensure Node 16+ and npm are available and then run `npm install`.

If you do not have node installed, you may use `./setup.sh` which will download
a compatible runtime and install npm dependencies. Caution is advised running
the script if you have an older version of node installed and have applications
which require the older runtime.

## Usage

TODO

### Developer Commands

| Command                      | Description                          |
|------------------------------|--------------------------------------|
| `npm run build`              | Write compiled output to `./out`     |
| `npm run coverage`           | Write code coverage to `./coverage`  |
| `npm run lint`               | Run `eslint`                         |
| `npm run lint:fix`           | Run `eslint --fix`                   |
| `npm run test`               | Run test suite                       |
| `npm run test -- --watchAll` | Run test suite and watch for changes |
| `npm run start`              | Run application                      |
