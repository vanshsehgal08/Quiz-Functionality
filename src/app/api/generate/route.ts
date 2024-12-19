import { StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { initVertexAI, MODEL_CONFIG } from "./vertex-ai.config";
import { iteratorToStream } from "./stream.utils";
import { generatePrompt } from "./prompt.utils";
import { processFiles } from "./file.utils";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const notes = formData.get("notes");
    const quizCount = Number(formData.get("quizCount")) || 5;
    const difficulty = formData.get("difficulty")?.toString() || "Easy";

    if (files.length < 1 && !notes) {
      return new NextResponse("Please provide either a file or notes", {
        status: 400,
      });
    }

    // Initialize Vertex AI and get model
    const vertexAI = initVertexAI();
    const generativeModel = vertexAI.preview.getGenerativeModel(MODEL_CONFIG);

    // Process files or notes
    const filesData = await processFiles(files);
    const contentData = files.length > 0 
      ? filesData 
      : [{ text: notes?.toString() || "No notes" }];

    // Generate prompt and prepare request body
    const promptParts = generatePrompt({ 
      difficulty, 
      totalQuizQuestions: quizCount 
    });

    const body = {
      contents: [{ 
        role: "user", 
        parts: [...promptParts, ...contentData] 
      }],
    };

    // Get response stream
    const resp = await generativeModel.generateContentStream(body);

    if (!resp?.stream) {
      throw new Error("Invalid API response: Missing stream");
    }

    // Convert to streaming response
    const stream = await iteratorToStream(resp.stream);

    return new StreamingTextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
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