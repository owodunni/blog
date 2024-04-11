import { type PageProps } from "$fresh/server.ts";
import Navbar from "../components/navbar.tsx";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Alexander's blog</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="mx-auto max-w-xl prose px-2">
        <Navbar />
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
