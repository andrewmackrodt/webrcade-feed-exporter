#!/bin/bash
set -euo pipefail
base_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$base_dir"

function install_node() {
  echo -n "detecting node version: " >&2
  local nodeVersion
  nodeVersion=$(node --version 2>/dev/null || true)
  echo "${nodeVersion:-n/a}" >&2

  echo -n "node install required: " >&2
  local nodeMajorVersion
  nodeMajorVersion=$(node --version 2>/dev/null | sed -E 's/[^0-9]*([0-9]+).*/\1/' || echo "0")

  if [[ $nodeMajorVersion -ge 16 ]]; then
    echo "no"
    return
  fi

  echo "yes"

  echo -n "detecting nvm version: " >&2
  local nvmVersion
  nvmVersion=$(nvm --version 2>/dev/null || true)
  echo "${nvmVersion:-n/a}" >&2

  echo -n "nvm install required: " >&2

  if [[ "$nvmVersion" == "" ]]; then
    echo "yes"
    echo "installing nvm .."
    curl -fsSL -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash >/dev/null
    if [[ "${NVM_DIR:-}" == "" ]]; then
      export NVM_DIR="$HOME/.nvm"
    fi
    set +e
    . ~/.nvm/nvm.sh
    set -e
  else
    echo "no"
  fi

  echo "installing node 16 .."
  nvm install lts/gallium

  # todo don't force default version
  echo "aliasing node 16 as default .."
  nvm alias default lts/gallium
}

function npm_install() {
  echo "installing npm dependencies .."
  npm install --silent
}

install_node && npm_install
