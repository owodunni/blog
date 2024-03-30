FROM denoland/deno
WORKDIR /app
COPY . .

RUN deno task cache

CMD [ "deno", "task", "build" ]
