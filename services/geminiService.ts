import { GoogleGenAI, Modality } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateFlag(townName: string, summary: string): Promise<{ imageUrl: string; text: string; }> {
  const prompt = `Create a modern, simple flag for the town of ${townName}, Massachusetts. The design should be inspired by the town's history and character, summarized as: "${summary}".

  Follow the key principles of good flag design (vexillology), which keep the designs simple while using symbolism based on the town's history and character in a style inspired by flat vector designs. 
  
  There should be a maximum of one symbol on the flag. There should be no text on the flag whatsoever. 
  
  Symbols should be meaningful and relevant to the town's summary provided. 

  The final image should be a clean rectangular graphic of the flag itself. The text response should include the town summary to explain what the flag is being generated to reflect.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
  });

  // Extract the first image from the response
  const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

  // Extract the text part of the response
  const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
  console.log(textPart);

  if (imagePart && imagePart.inlineData) {
      const { data, mimeType } = imagePart.inlineData;
      return {
        "imageUrl": `data:${mimeType};base64,${data}`,
        "text": textPart.text,
      }
      // return `data:${mimeType};base64,${data}`;
  }

  throw new Error("No image data found in the API response.");
}

export async function generateFlagDescription(imageDataUrl: string, townName: string): Promise<string> {
    const base64Data = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.match(/:(.*?);/)?.[1] ?? 'image/jpeg';

    const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

    const textPart = {
        text: `This is a newly generated flag for ${townName}, Massachusetts. Based on the visual elements, provide a 1-2 sentence summary explaining the flag's potential symbolism.`,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
}