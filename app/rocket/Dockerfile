FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn*.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .


# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "dev"]
