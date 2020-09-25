#!/usr/bin/env bash

su - docker

docker pull docker.pkg.github.com/mahalde/plahner-backend/plahner:latest

docker stop plahner-backend
docker rm plahner-backend
docker run -dp 80:3000 --name plahner-backend plahner-backend