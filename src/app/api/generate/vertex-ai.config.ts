import { HarmBlockThreshold, HarmCategory, VertexAI } from "@google-cloud/vertexai";

// Initialize Vertex AI configuration
export const initVertexAI = () => {
  try {
    const base64Key = process.env.GOOGLE_SERVICE_KEY;
    if (!base64Key) {
      throw new Error("GOOGLE_SERVICE_KEY environment variable is not set");
    }

    const decodedKey = Buffer.from(base64Key, "base64").toString();
    if (!decodedKey) {
      throw new Error("Failed to decode GOOGLE_SERVICE_KEY");
    }

    const credentials = JSON.parse(decodedKey);
    
    return new VertexAI({
      project: "nice-opus-445107-u3",
      location: "us-south1",
      googleAuthOptions: {
        credentials,
      },
    });
  } catch (error) {
    console.error("VertexAI initialization error:", error);
    throw new Error("Failed to initialize VertexAI: " + (error instanceof Error ? error.message : "Unknown error"));
  }
};

// Model configuration
export const MODEL_CONFIG = {
  model: "gemini-1.5-pro-preview-0409",
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.8, // Reduced for more consistent JSON output
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