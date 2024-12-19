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

// // Initialize Vertex with your Cloud project and location
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

function iteratorToStream(iterator: any) {
  return new ReadableStream({
    async pull(controller) {
      const { value, done } = await iterator.next();

      if (done || !value) {
        controller.close();
      } else {
        const data = value.candidates[0].content.parts[0].text;

        // controller.enqueue(`data: ${data}\n\n`);
        controller.enqueue(data);
      }
    },
  });
}

export async function POST(req: Request) {
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
    text: `You are an all-rounder tutor with professional expertise in different fields. You are to generate a list of quiz questions from the document(s) with a difficulty of ${
      difficulty || "Easy"
    }.`,
  };
  const text2 = {
    text: `Your response should be in JSON as an array of objects below. Respond with ${
      totalQuizQuestions || 5
    } different questions:
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
    "answer": "",
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

  const data =
    files.length > 0 ? filesData : [{ text: notes?.toString() || "No notes" }];

  const body = {
    contents: [{ role: "user", parts: [text1, ...data, text2] }],
  };

  // Call the Vertex AI model to generate the content stream
  const resp = await generativeModel.generateContentStream(body);

  // Collect the streamed content and format it as JSON
  let responseText = "";
  const stream = iteratorToStream(resp.stream);
  const reader = stream.getReader();
  
  // Read the stream and append the content into a response text variable
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  responseText = chunks.join("");

  // Return the response as JSON after collecting all content
  const quizQuestions = JSON.parse(responseText); // Ensure the response text is valid JSON

  return new NextResponse(JSON.stringify(quizQuestions), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  });
}
