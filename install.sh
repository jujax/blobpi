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

sudo $NPM install -g pm2
PM=$(command -v pm2)

echo "Install in progress ..."
$NPM install && \
$NPM run build && \
echo "Install finished" && \
$PM startup && \
exit 0
