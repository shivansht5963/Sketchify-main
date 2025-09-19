import { GoogleGenerativeAI } from "@google/generative-ai";
import { canvasToImage } from "./aiAssistantService"; // Reuse the canvas capture function

// Initialize with API key from environment variables or fallback to default
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyB3WGC_mitL3o_uHyFhASPrO5RhvbV9LEI";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Analyzes the canvas image and user input to generate a search query
 * @param imageData Base64 image data from canvas
 * @param userInput User's input text
 * @returns Generated search query
 */
export const generateSearchQuery = async (
  imageData: string,
  userInput: string = ''
): Promise<string> => {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Extract base64 data
    const imageBase64 = imageData.split(',')[1];
    
    // Prepare image data
    const imageFileData = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    };

    // Create a specific prompt for generating precise search queries
    const systemPrompt = 
      "You are an object recognition system. Analyze the uploaded image and identify what object is drawn. " +
      "Your response should be ONLY the precise name of the object (a single word if possible), without any descriptions or qualifiers. " +
      "For example, if you see an apple, respond with just 'apple'. If you see a car, respond with just 'car'. " +
      "Do not include words like 'drawing', 'sketch', 'outline', etc. Focus only on the core object name.";

    // Log request details
    console.log('Generating search query based on:', {
      userInput,
      imageDataLength: imageBase64.length
    });

    // Generate search query with both image and text
    const result = await model.generateContent([systemPrompt, imageFileData]);
    const response = await result.response;
    
    // Return the search query text
    return response.text().trim();
    
  } catch (error: any) {
    console.error('Error generating search query:', error);
    return "Error generating search query: " + (error?.message || "Unknown error");
  }
};

