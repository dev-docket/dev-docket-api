# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install pnpm
RUN curl -f https://get.pnpm.io/v6.16.js | node - add --global pnpm

# Copy application dependency manifests to the container image.
COPY package.json pnpm-lock.yaml ./

# Install app dependencies
RUN pnpm install --frozen-lockfile --prod

# Bundle app source
COPY . .

# Build the app
RUN pnpm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]