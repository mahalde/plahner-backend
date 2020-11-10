/* eslint-disable */
const { PubSub } = require('@google-cloud/pubsub');
const dotenv = require('dotenv');
const { readFileSync } = require('fs');
const path = require('path');

const pathToJSON = path.resolve(__dirname, 'default-message.json');
dotenv.config({ path: '.development.env' });

const pubsub = new PubSub();

pubsub.topic(process.env.GCLOUD_TOPIC_NAME).publish(readFileSync(pathToJSON));