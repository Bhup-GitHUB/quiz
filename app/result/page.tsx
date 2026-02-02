"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { questions } from "@/lib/questions";

interface Response {
  id: string;
  name?: string;
  answers: Record<string, string>;
  submittedAt: string;
}

function getScore(answers: Record<string, string>): number {
  return questions.filter((q) => answers[q.id] === q.correctAnswer).length;
}

export default function ResultsPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const response = await fetch("/api/results");
        const data = await response.json();
        setResponses(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <p className="text-gray-500 text-sm">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-center mb-4">
          Responses
        </h1>
        <p className="text-gray-500 text-sm text-center mb-12">
          {responses.length} submission{responses.length !== 1 ? "s" : ""}
        </p>

        {responses.length === 0 ? (
          <p className="text-center text-gray-500 text-sm">No responses yet.</p>
        ) : (
          <div className="space-y-8">
            {responses.map((response, idx) => {
              const score = getScore(response.answers);
              return (
                <div key={response.id} className="border border-gray-800 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="font-serif text-xl mb-1">
                        {response.name || "Anonymous"}
                      </h2>
                      <p className="text-xs text-gray-600">
                        {new Date(response.submittedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl">
                        <span className="text-white">{score}</span>
                        <span className="text-gray-500">/{questions.length}</span>
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {questions.map((question) => {
                      const userAnswer = response.answers[question.id];
                      const isCorrect = userAnswer === question.correctAnswer;
                      return (
                        <div key={question.id} className="flex items-start gap-2">
                          <span className={`text-sm ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                            {isCorrect ? "✓" : "✗"}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-500 text-xs">{question.text}</p>
                            <p className={`text-sm ${isCorrect ? "text-white" : "text-red-400"}`}>
                              {userAnswer || "Not answered"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <Link
                      href={`/dashboard/${response.id}`}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      View full results →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
