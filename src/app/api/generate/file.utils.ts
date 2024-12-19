export async function processFiles(files: File[]) {
  if (files.length === 0) return [];

  const filesBase64 = await Promise.all(
    files.map(async (file) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return buffer.toString("base64");
    })
  );

  return filesBase64.map((b64, i) => ({
    inlineData: {
      mimeType: files[i].type,
      data: b64,
    },
  }));
}