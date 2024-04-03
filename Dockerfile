FROM denoland/deno
WORKDIR /app
COPY . .

RUN deno task cache && deno task build

EXPOSE 3000

CMD [ "deno", "task", "preview" ]
