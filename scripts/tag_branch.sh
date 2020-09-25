#!/usr/bin/env bash

version=$(cat package.json | grep -oP '(?<=\"version\": \")[^\"]*')

git tag -a "v$version" -m "Release of version: $version"

git push --tags