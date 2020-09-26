# Base image for building
FROM node:12.6.0-slim as build-stage

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
# If you add a package-lock.json, speed your build by switching to 'npm ci'
RUN npm i

# Add app
COPY . /app/

# Build the backend
RUN npm run build

# Base image for serving
FROM node:12.6.0-alpine

# Set working directory
WORKDIR /app

# Set to production mode
ENV NODE_ENV=production

# Copy the compiled app code and package files
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package*.json /app/

# Install production modules
RUN npm ci --only=production

# Start the backend
CMD ["node", "/app/src/main"]