#!/usr/bin/env bash

version=$(cat package.json | grep -oP '(?<=\"version\": \")[^\"]*')

echo $(git config -l)

git init

git config --global user.name "${1}"

git config --global user.email "${2}"

echo $(git config -l)

git tag -a "v$version" -m "Release of version: $version"

git push --tags