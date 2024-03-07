FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
CMD [ "node", "--enable-source-maps", "-r", "dotenv/config", "build" ]
