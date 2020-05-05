FROM node:10

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
EXPOSE 8080

ENTRYPOINT ["npm", "start"]
