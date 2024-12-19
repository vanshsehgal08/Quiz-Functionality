export interface QuizPromptParams {
  difficulty?: string;
  totalQuizQuestions?: number;
}

export function generatePrompt({ difficulty = "Easy", totalQuizQuestions = 5 }: QuizPromptParams) {
  return [
    {
      text: `You are an all-rounder tutor with professional expertise in different fields. Generate exactly ${totalQuizQuestions} quiz questions with a difficulty of ${difficulty}. Format the response as a JSON array.`,
    },
    {
      text: `Response must be a valid JSON array matching this structure:
[
  {
    "id": 1,
    "question": "question text",
    "description": "description text",
    "options": {
      "a": "option a",
      "b": "option b",
      "c": "option c",
      "d": "option d"
    },
    "answer": "correct answer letter"
  }
]`,
    },
  ];
}