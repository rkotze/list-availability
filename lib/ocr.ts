import Tesseract from "tesseract.js";

export async function extractTextFromImage(
  image: File | Blob
): Promise<string> {
  const result = await Tesseract.recognize(image, "eng", {
    logger: (m) => console.log(m),
  });
  return result.data.text;
}
