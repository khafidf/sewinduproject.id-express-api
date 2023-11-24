# Use the official Node.js image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy all files from the current directory to the working directory in the container
COPY . .

# Set environment variables
ENV PORT=3030
ENV MONGO_URL="mongodb+srv://sewinduproject:sewinduproject177@cluster0.jbsyhql.mongodb.net/sewinduproject"
ENV JWT_SECRET="njkiah1ui4190481idja1klr314"
ENV API_KEY="AIzaSyCpXhTlIbKlOwQBWtDEoyJ64T5Oc8ydoG0"
ENV AUTH_DOMAIN="sewinduproject-38bf1.firebaseapp.com"
ENV PROJECT_ID="sewinduproject-38bf1"
ENV STORAGE_BUCKET="sewinduproject-38bf1.appspot.com"
ENV MESSAGE_SENDER_ID="189520943199"
ENV APP_ID="1:189520943199:web:1794db02e02daae38be3ea"
ENV HOST="smtp.example.com"
ENV USER="test.sewinduproject@gmail.com"
ENV PASS="ytvlhkqovdwcgjlw"
ENV SERVICE="gmail"
ENV BASE_URL="http://localhost:3030/api"

# Expose the port the app runs on
EXPOSE $PORT

# Command to start the application
CMD ["npm", "start"]
