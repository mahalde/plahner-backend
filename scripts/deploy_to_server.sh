#!/usr/bin/env bash

su - docker

docker pull ghcr.io/mahalde/plahner-backend:latest

docker stop plahner-backend
docker rm plahner-backend
docker run -dp 80:3000 --name plahner-backend ghcr.io/mahalde/plahner-backend:latest