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

const vertex_ai = new VertexAI({
  project: "nice-opus-445107-u3",
  location: "us-south1",
  googleAuthOptions: {
    credentials,
  },
});
const model = "gemini-1.5-pro-preview-0409";

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

// Function to validate JSON string
function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to handle the iterator and stream data properly
async function iteratorToStream(iterator: AsyncGenerator<any, any, any>) {
  let accumulatedText = '';
  
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();

        if (done) {
          // Try to parse accumulated text as JSON before closing
          if (accumulatedText && isValidJSON(accumulatedText)) {
            controller.enqueue(accumulatedText);
          }
          controller.close();
          return;
        }

        if (value) {
          const data = value.candidates[0]?.content?.parts[0]?.text;
          if (data) {
            accumulatedText += data;
            
            // Only enqueue if we have valid JSON
            if (isValidJSON(accumulatedText)) {
              controller.enqueue(accumulatedText);
              accumulatedText = ''; // Reset accumulated text
            }
          }
        }
      } catch (error) {
        console.error("Stream Error:", error);
        controller.error(error);
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
      text: `You are an all-rounder tutor with professional expertise in different fields. You are to generate a list of quiz questions from the document(s) with a difficulty of ${difficulty || "Easy"}. The response must be valid JSON.`,
    };
    
    const text2 = {
      text: `Your response must be a valid JSON array of objects with the following structure for ${totalQuizQuestions || 5} different questions:
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

    const data =
      files.length > 0 ? filesData : [{ text: notes?.toString() || "No notes" }];

    const body = {
      contents: [{ role: "user", parts: [text1, ...data, text2] }],
    };

    const resp = await generativeModel.generateContentStream(body);

    if (!resp || !resp.stream) {
      throw new Error("Invalid API response: Missing stream or data");
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
    console.error("Error processing request:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An error occurred while processing your request";
      
    return new NextResponse(errorMessage, { status: 500 });
  }
}