"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";

const TIMER_SECONDS = 10;

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const answersRef = useRef(answers);
  const selectedOptionRef = useRef(selectedOption);

  // Keep refs in sync with state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    selectedOptionRef.current = selectedOption;
  }, [selectedOption]);

  useEffect(() => {
    const storedName = sessionStorage.getItem("quizName");
    if (!storedName) {
      router.push("/");
      return;
    }
    setName(storedName);
  }, [router]);

  const submitQuiz = useCallback(async (finalAnswers: Record<string, string>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          answers: finalAnswers,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.removeItem("quizName");
        router.push(`/thankyou?id=${data.id}`);
      } else {
        console.error("Failed to submit quiz");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      setIsSubmitting(false);
    }
  }, [name, router, isSubmitting]);

  const moveToNext = useCallback((currentAnswers: Record<string, string>, currentSelected: string) => {
    const newAnswers = currentSelected
      ? { ...currentAnswers, [questions[currentQuestion].id]: currentSelected }
      : currentAnswers;

    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption("");
      setTimeLeft(TIMER_SECONDS);
    } else {
      submitQuiz(newAnswers);
    }
  }, [currentQuestion, submitQuiz]);

  // Timer effect
  useEffect(() => {
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Use refs to get current values
          moveToNext(answersRef.current, selectedOptionRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, isSubmitting, moveToNext]);

  const handleNext = () => {
    if (selectedOption) {
      moveToNext(answers, selectedOption);
    }
  };

  const handleSubmit = () => {
    const finalAnswers = selectedOption
      ? { ...answers, [questions[currentQuestion].id]: selectedOption }
      : answers;
    submitQuiz(finalAnswers);
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  // Timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 6) return "bg-green-500";
    if (timeLeft > 3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTimerTextColor = () => {
    if (timeLeft > 6) return "text-green-500";
    if (timeLeft > 3) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-xl">
        <p className="text-gray-500 text-xs tracking-widest uppercase mb-4 text-center">
          {currentQuestion + 1} / {questions.length}
        </p>

        {/* Timer */}
        <div className="mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className={`text-lg font-mono ${getTimerTextColor()} ${timeLeft <= 3 ? "animate-pulse" : ""}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${getTimerColor()} transition-all duration-1000 ease-linear`}
              style={{ width: `${(timeLeft / TIMER_SECONDS) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl text-center mb-12 leading-relaxed">
          {currentQ.text}
        </h2>

        <div className="space-y-3 mb-12">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(option)}
              disabled={isSubmitting}
              className={`w-full text-left px-5 py-4 rounded-lg border transition-all ${
                selectedOption === option
                  ? "border-white bg-white/5 text-white"
                  : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={isLastQuestion ? handleSubmit : handleNext}
            disabled={!selectedOption || isSubmitting}
            className={`px-8 py-2.5 text-sm border rounded-full transition-colors ${
              selectedOption && !isSubmitting
                ? "border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
                : "border-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : isLastQuestion ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}
