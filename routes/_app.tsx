import { type PageProps } from "$fresh/server.ts";
export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Alexander's blog</title>
      </head>
      <body>
        <header>
          <nav>
            <a href="/">Home</a>
            {" | "}
            <a href="/posts/">Posts</a>
          </nav>
        </header>
        <Component />
        <footer>
          <p>
            Author: <a href="mailto:alex.o.poole@gmail.com">Alexander Poole</a>
          </p>
        </footer>
      </body>
    </html>
  );
}