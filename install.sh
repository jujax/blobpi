#!/bin/bash

NPM=$(command -v npm)
NODE=$(command -v node)

if  ! command -v npm &> /dev/null; then
    echo "npm is not installed"
    exit 1
fi

if  ! command -v node &> /dev/null; then
    echo "node is not installed"
    exit 1
fi

if [[ "$EUID" = 0 ]]; then
    echo "Install in progress ..."
    $NPM install && \
    $NPM run build && \
    $NODE install/install.js && \
    echo "Install finished" && \
    exit 0
else
    echo "Must be launched with sudo"
    exit 1
fi