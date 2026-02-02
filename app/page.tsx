"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleStart = () => {
    if (name.trim()) {
      sessionStorage.setItem("quizName", name.trim());
      router.push("/quiz");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-12">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight">
            Emotional Intelligence
          </h1>
          <p className="text-gray-400 text-sm md:text-base font-light">
            A quick self-assessment
          </p>
        </div>

        <div className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="w-64 px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-center text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
          <div>
            <button
              onClick={handleStart}
              disabled={!name.trim()}
              className={`px-6 py-2.5 text-sm border rounded-full transition-colors ${
                name.trim()
                  ? "border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
                  : "border-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              Begin
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
