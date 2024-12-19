import { StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { initVertexAI, MODEL_CONFIG } from "./vertex-ai.config";
import { iteratorToStream } from "./stream.utils";
import { generatePrompt } from "./prompt.utils";
import { processFiles } from "./file.utils";
import { API_CONFIG } from "./config";

export const runtime = 'edge'; // Use edge runtime for better performance

export async function POST(req: Request) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const notes = formData.get("notes");
    const quizCount = Number(formData.get("quizCount")) || 5;
    const difficulty = formData.get("difficulty")?.toString() || "Easy";

    // Validate input
    if (files.length > API_CONFIG.MAX_FILES) {
      return new NextResponse(`Maximum ${API_CONFIG.MAX_FILES} files allowed`, { 
        status: 400 
      });
    }

    if (files.some(file => file.size > API_CONFIG.MAX_FILE_SIZE)) {
      return new NextResponse(`Files must be under ${API_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB`, { 
        status: 400 
      });
    }

    if (files.length < 1 && !notes) {
      return new NextResponse("Please provide either a file or notes", { 
        status: 400 
      });
    }

    // Initialize Vertex AI with timeout
    const vertexAI = initVertexAI();
    const generativeModel = vertexAI.preview.getGenerativeModel({
      ...MODEL_CONFIG,
      httpOptions: {
        timeout: API_CONFIG.TIMEOUT_MS,
        signal: controller.signal,
      },
    });

    // Process files or notes with timeout
    const filesData = await Promise.race([
      processFiles(files),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("File processing timeout")), API_CONFIG.TIMEOUT_MS)
      ),
    ]) as ReturnType<typeof processFiles>;

    const contentData = files.length > 0 
      ? filesData 
      : [{ text: notes?.toString() || "No notes" }];

    // Generate prompt and prepare request
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

    // Get response stream with timeout
    const resp = await Promise.race([
      generativeModel.generateContentStream(body),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Model response timeout")), API_CONFIG.TIMEOUT_MS)
      ),
    ]) as Awaited<ReturnType<typeof generativeModel.generateContentStream>>;

    if (!resp?.stream) {
      throw new Error("Invalid API response: Missing stream");
    }

    // Convert to streaming response
    const stream = await iteratorToStream(resp.stream);

    clearTimeout(timeoutId);

    return new StreamingTextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return new NextResponse("Request timeout", { status: 504 });
    }

    console.error("Error processing request:", error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : "An error occurred while processing your request";
      
    return new NextResponse(errorMessage, { 
      status: error instanceof Error && error.name === 'AbortError' ? 504 : 500 
    });
  }
}