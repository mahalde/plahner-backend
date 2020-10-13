# Base image for building
FROM node:12.18.0-slim as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Add app
COPY . /app/

# Build the backend
RUN yarn build

# Base image for serving
FROM node:12.18.0-alpine

# Set working directory
WORKDIR /app

# Set to production mode
ENV NODE_ENV=production

# Copy the compiled app code and package files
COPY --from=build-stage /app/dist /app/package.json /app/yarn.lock /app/

# Install production modules
RUN yarn install --frozen-lockfile --prod

# Install pm2
RUN npm install pm2 -g

# Start the backend
CMD ["pm2-runtime", "/app/src/main.js"]