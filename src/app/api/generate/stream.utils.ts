// Function to validate JSON string
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to clean and validate JSON string
export function cleanJSONString(str: string): string {
  // Remove any leading/trailing non-JSON content
  let cleaned = str.trim();
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');
  
  if (firstBracket !== -1 && lastBracket !== -1) {
    cleaned = cleaned.substring(firstBracket, lastBracket + 1);
  }
  
  return cleaned;
}

// Function to handle the iterator and stream data properly
export async function iteratorToStream(iterator: AsyncGenerator<any, any, any>) {
  let buffer = '';
  let isFirstChunk = true;
  
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();

        if (done) {
          if (buffer) {
            const cleanedJSON = cleanJSONString(buffer);
            if (isValidJSON(cleanedJSON)) {
              controller.enqueue(cleanedJSON);
            } else {
              console.error("Invalid JSON in final buffer:", buffer);
            }
          }
          controller.close();
          return;
        }

        const chunk = value?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunk) {
          // Handle first chunk differently to ensure proper JSON start
          if (isFirstChunk) {
            const startBracket = chunk.indexOf('[');
            buffer = startBracket !== -1 ? chunk.substring(startBracket) : chunk;
            isFirstChunk = false;
          } else {
            buffer += chunk;
          }

          // Try to validate JSON
          const cleanedJSON = cleanJSONString(buffer);
          if (isValidJSON(cleanedJSON)) {
            controller.enqueue(cleanedJSON);
            buffer = '';
          }
        }
      } catch (error) {
        console.error("Stream processing error:", error);
        controller.error(new Error("Stream processing failed: " + (error instanceof Error ? error.message : "Unknown error")));
      }
    },
  });
}