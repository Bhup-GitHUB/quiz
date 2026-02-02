"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-10">
        <div className="space-y-4">
          <h1 className="font-serif text-3xl md:text-4xl font-normal">
            Thank you
          </h1>
          <p className="text-gray-500 text-sm">
            Your responses have been recorded.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {id && (
            <Link
              href={`/dashboard/${id}`}
              className="inline-block px-6 py-2.5 text-sm border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
            >
              View your results
            </Link>
          )}
          <Link
            href="/result"
            className="inline-block px-6 py-2.5 text-sm border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
          >
            View all scores
          </Link>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <p className="text-gray-500 text-sm">Loading...</p>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
