#!/usr/bin/env bash

version=$(cat package.json | grep -oP '(?<=\"version\": \")[^\"]*')

git config user.name "${1}"

git config user.email "${2}"

git tag -a "v$version" -m "Release of version: $version"

git push --tags