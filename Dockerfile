FROM denoland/deno
WORKDIR /app
COPY . .

RUN deno task cache

EXPOSE 3000

CMD [ "deno", "task", "start" ]
