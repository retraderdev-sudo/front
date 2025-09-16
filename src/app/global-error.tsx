'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
            <p className="mb-8 text-muted-foreground">
              A global error occurred in the application.
            </p>
            <button
              onClick={reset}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
