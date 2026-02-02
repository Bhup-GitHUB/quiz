"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { questions } from "@/lib/questions";

export default function QuizPage() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const storedName = sessionStorage.getItem("quizName");
    if (!storedName) {
      router.push("/");
      return;
    }
    setName(storedName);
  }, [router]);

  const handleNext = () => {
    if (selectedOption) {
      const newAnswers = {
        ...answers,
        [questions[currentQuestion].id]: selectedOption,
      };
      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(newAnswers[questions[currentQuestion + 1].id] || "");
      }
    }
  };

  const handleSubmit = async () => {
    if (selectedOption) {
      const finalAnswers = {
        ...answers,
        [questions[currentQuestion].id]: selectedOption,
      };

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
        }
      } catch (error) {
        console.error("Error submitting quiz:", error);
      }
    }
  };

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-8">
      <div className="w-full max-w-xl">
        <p className="text-gray-500 text-xs tracking-widest uppercase mb-12 text-center">
          {currentQuestion + 1} / {questions.length}
        </p>

        <h2 className="font-serif text-2xl md:text-3xl text-center mb-12 leading-relaxed">
          {currentQ.text}
        </h2>

        <div className="space-y-3 mb-12">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedOption(option)}
              className={`w-full text-left px-5 py-4 rounded-lg border transition-all ${
                selectedOption === option
                  ? "border-white bg-white/5 text-white"
                  : "border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
              }`}
            >
              <span className="text-sm">{option}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={isLastQuestion ? handleSubmit : handleNext}
            disabled={!selectedOption}
            className={`px-8 py-2.5 text-sm border rounded-full transition-colors ${
              selectedOption
                ? "border-gray-600 text-gray-300 hover:text-white hover:border-gray-400"
                : "border-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isLastQuestion ? "Submit" : "Next"}
          </button>
        </div>
      </div>
    </main>
  );
}
