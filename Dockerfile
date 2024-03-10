FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci 
COPY . .
RUN npm run build && npm prune --omit=dev
ENV NODE_ENV=production

FROM golang:1.21-alpine AS server

LABEL stage=builder

RUN addgroup -S myapp \
    && adduser -S -u 10000 -g myapp myapp

ENV GO111MODULE=on

WORKDIR /app
COPY go.mod go.sum main.go .
COPY --from=builder /app/build/ /app/build/

RUN CGO_ENABLED=0 GOOS=linux go build \
    -o /app/bin/service \
    .

ENTRYPOINT ["/app/bin/service"]
