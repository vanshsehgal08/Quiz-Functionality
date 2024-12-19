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

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: "nice-opus-445107-u3",
  location: "us-south1",
  googleAuthOptions: {
    credentials,
  },
});
const model = "gemini-1.5-pro-preview-0409";

// Instantiate the models
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

// Function to handle the iterator and stream data properly
function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();

        if (done || !value) {
          controller.close();
        } else {
          const data = value.candidates[0]?.content?.parts[0]?.text;
          if (data) {
            controller.enqueue(data);
          } else {
            controller.close();
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

    // Validate if there are files or notes provided
    if (files.length < 1 && !notes) {
      return new NextResponse("Please provide either a file or notes", {
        status: 400,
      });
    }

    // Construct the prompt text
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

    // Convert files to base64
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

    // Build the body for the request
    const body = {
      contents: [{ role: "user", parts: [text1, ...data, text2] }],
    };

    // Log the body to ensure the structure is correct
    console.log("Request Body:", JSON.stringify(body, null, 2));

    // Call the generative model API
    const resp = await generativeModel.generateContentStream(body);

    // Check if the response contains the expected structure
    if (!resp || !resp.stream) {
      throw new Error("Invalid API response structure");
    }

    // Log the raw response to check for any issues
    console.log('API Response:', resp);

    // Convert the response into a friendly text-stream
    const stream = iteratorToStream(resp.stream);

    // Return the streaming response
    return new StreamingTextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error processing the request:", error);

    // Respond with more specific error messages
    const errorMessage =
      error instanceof Error ? error.message : "An error occurred while processing your request.";

    return new NextResponse(errorMessage, {
      status: 500,
    });
  }
}
