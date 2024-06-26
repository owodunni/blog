import { type PageProps } from "$fresh/server.ts";

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Alexander Poole Jardén</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body className="p-m sm:px-0 py-xl text-[18px] sm:text-[16px] dark:bg-slate-800 dark:text-slate-200">
        <Component />
      </body>
    </html>
  );
}
