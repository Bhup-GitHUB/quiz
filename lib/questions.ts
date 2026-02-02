export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export const questions: Question[] = [
  {
    id: "q1",
    text: "When I feel stressed or angry, I usually:",
    options: [
      "React immediately",
      "Pause and think before reacting",
      "Ignore the feeling"
    ],
    correctAnswer: "Pause and think before reacting"
  },
  {
    id: "q2",
    text: "During disagreements, I:",
    options: [
      "Get defensive or upset",
      "Stay calm and listen",
      "Avoid the situation"
    ],
    correctAnswer: "Stay calm and listen"
  },
  {
    id: "q3",
    text: "When someone is upset, I:",
    options: [
      "Focus only on my point",
      "Try to understand their feelings",
      "Feel uncomfortable and change the topic"
    ],
    correctAnswer: "Try to understand their feelings"
  },
  {
    id: "q4",
    text: "After failure or criticism, I:",
    options: [
      "Feel demotivated for a long time",
      "Reflect and try to improve",
      "Blame external factors"
    ],
    correctAnswer: "Reflect and try to improve"
  },
  {
    id: "q5",
    text: "When expressing my emotions, I:",
    options: [
      "Keep everything inside",
      "Communicate clearly and respectfully",
      "Express emotions without filtering"
    ],
    correctAnswer: "Communicate clearly and respectfully"
  }
];
