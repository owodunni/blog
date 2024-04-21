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
      <body className="mx-auto max-w-xl px-m sm:px-0 text-[18px] sm:text-[16px]">
        <Navbar />
        <Component />
        <footer className="my-xl">
          <p className="text-overline-light">
            Author:{" "}
            <a className="underline" href="mailto:alex.o.poole@gmail.com">
              Alexander Poole
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
