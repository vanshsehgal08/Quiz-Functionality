// Function to validate JSON string
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

// Function to handle the iterator and stream data properly
export async function iteratorToStream(iterator: AsyncGenerator<any, any, any>) {
  let buffer = '';
  
  return new ReadableStream({
    async pull(controller) {
      try {
        const { value, done } = await iterator.next();

        if (done) {
          if (buffer) {
            try {
              // Try to parse and format the final buffer content
              const jsonData = JSON.parse(buffer);
              controller.enqueue(JSON.stringify(jsonData));
            } catch (e) {
              console.error("Final JSON parsing failed:", e);
            }
          }
          controller.close();
          return;
        }

        if (value?.candidates?.[0]?.content?.parts?.[0]?.text) {
          buffer += value.candidates[0].content.parts[0].text;
          
          // Try to parse the accumulated buffer
          try {
            JSON.parse(buffer);
            // If parsing succeeds, enqueue the valid JSON
            controller.enqueue(buffer);
            buffer = '';
          } catch (e) {
            // If parsing fails, continue accumulating
          }
        }
      } catch (error) {
        console.error("Stream Error:", error);
        controller.error(error);
      }
    },
  });
}