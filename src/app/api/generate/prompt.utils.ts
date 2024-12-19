export interface QuizPromptParams {
  difficulty?: string;
  totalQuizQuestions?: number;
}

export function generatePrompt({ difficulty = "Easy", totalQuizQuestions = 5 }: QuizPromptParams) {
  return [
    {
      text: `You are an expert tutor. Generate exactly ${totalQuizQuestions} quiz questions with difficulty level ${difficulty}. 
IMPORTANT: Your response must be a valid JSON array with no additional text before or after. Follow this exact format:`,
    },
    {
      text: `[
  {
    "id": 1,
    "question": "What is...",
    "description": "Brief explanation...",
    "options": {
      "a": "First option",
      "b": "Second option",
      "c": "Third option",
      "d": "Fourth option"
    },
    "answer": "a"
  }
]

Rules:
1. Response must start with [ and end with ]
2. No text before or after the JSON array
3. Use proper JSON formatting
4. Each question must have all fields shown above
5. IDs must be sequential starting from 1`,
    },
  ];
}