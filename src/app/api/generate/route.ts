import {
  HarmBlockThreshold,
  HarmCategory,
  VertexAI,
} from "@google-cloud/vertexai";
import { StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

const credentials = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_KEY || "", "base64").toString()
);

// Initialize Vertex AI
const vertex_ai = new VertexAI({
  project: "nice-opus-445107-u3",
  location: "us-south1",
  googleAuthOptions: {
    credentials,
  },
});
const model = "gemini-1.5-pro-preview-0409";

// Instantiate the generative model
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
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
});

// Safe JSON parsing with error handling and validation
async function safeParseJson(response: string) {
  if (!response) {
    throw new Error('Empty response');
  }
  
  // Clean the response string to ensure it's valid JSON
  let cleanedResponse = response.trim();
  // Ensure the response starts with [ and ends with ]
  if (!cleanedResponse.startsWith('[')) cleanedResponse = '[' + cleanedResponse;
  if (!cleanedResponse.endsWith(']')) cleanedResponse += ']';
  
  try {
    const parsed = JSON.parse(cleanedResponse);
    // Validate the structure
    if (!Array.isArray(parsed)) {
      throw new Error('Response is not an array');
    }
    return parsed;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error parsing JSON:", error.message);
      console.error("Raw response data:", response);
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
    throw new Error('An unknown error occurred while parsing JSON');
  }
}

// Improved stream handling with better error management
async function iteratorToStream(iterator: AsyncGenerator<any, any, any>) {
  let accumulatedData = "";
  let isFirstChunk = true;

  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();

        if (done) {
          if (accumulatedData) {
            try {
              // Only try to parse as JSON at the end of the stream
              const parsedData = await safeParseJson(accumulatedData);
              controller.enqueue(JSON.stringify(parsedData));
            } catch (error) {
              if (error instanceof Error) {
                console.error("Final parsing error:", error.message);
                controller.error(error);
              } else {
                console.error("Unknown final parsing error");
                controller.error(new Error("Unknown parsing error occurred"));
              }
            }
          }
          controller.close();
          return;
        }

        if (value) {
          const chunk = value.candidates[0]?.content?.parts[0]?.text;
          if (chunk) {
            // Accumulate the data
            accumulatedData += chunk;
            
            // Stream the raw chunk
            if (isFirstChunk) {
              controller.enqueue(chunk);
              isFirstChunk = false;
            } else {
              controller.enqueue(chunk);
            }
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Stream processing error:", error.message);
          controller.error(error);
        } else {
          console.error("Unknown stream processing error");
          controller.error(new Error("Unknown stream processing error occurred"));
        }
      }
    },
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const notes = formData.get("notes");
    const totalQuizQuestions = formData.get("quizCount");
    const difficulty = formData.get("difficulty");
    const topic = formData.get("topic");

    if (files.length < 1 && !notes) {
      return new NextResponse("Please provide either a file or notes", {
        status: 400,
      });
    }

    const text1 = {
      text: `You are an all-rounder tutor with professional expertise in different fields. You are to generate a list of quiz questions from the document(s) with a difficulty of ${difficulty || "Easy"}.`,
    };
    const text2 = {
      text: `Your response should be in JSON format as an array of objects below. Respond with ${totalQuizQuestions || 5} different questions.
      {
        "id": 1,
        "question": "",
        "description": "",
        "options": {
          "a": "",
          "b": "",
          "c": "",
          "d": ""
        },
        "answer": ""
      }`,
    };

    const filesBase64 = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString("base64");
      })
    );

    const filesData = filesBase64.map((b64, i) => ({
      inlineData: {
        mimeType: files[i].type,
        data: b64,
      },
    }));

    const data = files.length > 0 ? filesData : [{ text: notes?.toString() || "No notes" }];

    const body = {
      contents: [{ role: "user", parts: [text1, ...data, text2] }],
    };

    const resp = await generativeModel.generateContentStream(body);

    if (!resp.stream) {
      return new NextResponse("No content received from the model.", {
        status: 500,
      });
    }

    const stream = await iteratorToStream(resp.stream);

    return new StreamingTextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error instanceof Error ? error.message : "Unknown error");
    const errorMessage = error instanceof Error ? error.message : "An error occurred while processing your request.";
    return new NextResponse(errorMessage, {
      status: 500,
    });
  }
}