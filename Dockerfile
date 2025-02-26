# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

COPY . .
x
RUN npm install


# Expose the application port (change if needed)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
