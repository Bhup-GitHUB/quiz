"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { questions } from "@/lib/questions";

interface Submission {
  id: string;
  name: string;
  answers: Record<string, string>;
  submittedAt: string;
}

export default function DashboardPage() {
  const params = useParams();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubmission() {
      try {
        const response = await fetch(`/api/dashboard/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setSubmission(data);
        }
      } catch (error) {
        console.error("Error fetching submission:", error);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchSubmission();
    }
  }, [params.id]);

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <p className="text-gray-500 text-sm">Loading...</p>
      </main>
    );
  }

  if (!submission) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <p className="text-gray-500 text-sm">Submission not found</p>
      </main>
    );
  }

  const correctCount = questions.filter(
    (q) => submission.answers[q.id] === q.correctAnswer
  ).length;

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-500 text-xs tracking-widest uppercase mb-4">
            Results
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mb-4">
            {submission.name}
          </h1>
          <p className="text-2xl">
            <span className="text-white">{correctCount}</span>
            <span className="text-gray-500">/{questions.length}</span>
          </p>
        </div>

        <div className="space-y-8 mb-12">
          {questions.map((question) => {
            const userAnswer = submission.answers[question.id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <div key={question.id} className="border-b border-gray-800 pb-8">
                <p className="text-gray-400 text-sm mb-3">{question.text}</p>
                <div className="flex items-start gap-3">
                  <span className={`text-lg ${isCorrect ? "text-green-500" : "text-red-500"}`}>
                    {isCorrect ? "✓" : "✗"}
                  </span>
                  <div>
                    <p className={isCorrect ? "text-white" : "text-red-400"}>
                      {userAnswer}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-500 text-sm mt-1">
                        Correct: {question.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 text-sm border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            Take again
          </Link>
        </div>
      </div>
    </main>
  );
}
