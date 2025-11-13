FROM node:22-alpine3.21 AS build

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# node-gyp requires python3
RUN apk add --no-cache python3 make g++

# Install dependencies using npm
RUN npm install

# Copy the project files into the working directory
COPY . .

# Build the React app for production
RUN npm run build


# Use the official NGINX image for production
FROM nginx:stable-alpine AS production

# copy nginx configuration in side conf.d folder
COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d

# Copy the build output from the dist folder into the Nginx html directory
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 3000 to allow access to the app
EXPOSE 3000

# Run Nginx in the foreground
ENTRYPOINT ["nginx", "-g", "daemon off;"] 
