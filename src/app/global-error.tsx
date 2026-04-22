'use client';

import { useEffect } from 'react';
import './globals.css';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background text-black antialiased">
        <div className="flex h-screen w-full items-center justify-center px-6">
          <section className="w-full max-w-md rounded-lg bg-white p-10 text-center shadow-md">
            <h1 className="pb-2 text-2xl font-semibold">Something went wrong</h1>
            <p className="pb-8 font-semibold">Please try again in a moment.</p>
            <button
              className="w-full cursor-pointer rounded border border-accent bg-accent px-4 py-2 text-sm text-white transition-colors hover:bg-medium-accent active:bg-dark-accent"
              type="button"
              onClick={reset}
            >
              Try again
            </button>
          </section>
        </div>
      </body>
    </html>
  );
}
