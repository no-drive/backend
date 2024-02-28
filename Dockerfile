# Use a lightweight Node.js image
FROM node:alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .


# Run the application
CMD ["node", "index.js"]
