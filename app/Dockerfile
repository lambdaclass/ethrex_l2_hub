FROM node:22-alpine3.21 AS build

# Set the working directory inside the container
WORKDIR /usr/src

# Copy package.json and package-lock.json into the container
COPY . .

# node-gyp requires python3
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

# Install dependencies using npm
RUN npm install

EXPOSE 5173

# Build and start the app
# TODO: change this so that the app can replace the environment variables at runtime
# without the need to build the app every time
ENTRYPOINT ["npm", "run", "dev"]
