import { HarmBlockThreshold, HarmCategory, VertexAI } from "@google-cloud/vertexai";

// Initialize Vertex AI configuration
export const initVertexAI = () => {
  const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY || "", "base64").toString()
  );

  return new VertexAI({
    project: "nice-opus-445107-u3",
    location: "us-south1",
    googleAuthOptions: {
      credentials,
    },
  });
};

// Model configuration
export const MODEL_CONFIG = {
  model: "gemini-1.5-pro-preview-0409",
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
};