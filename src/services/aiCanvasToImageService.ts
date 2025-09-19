import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key from environment variables or fallback to default
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyB3WGC_mitL3o_uHyFhASPrO5RhvbV9LEI";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Store multiple ImagePig API keys with usage tracking
interface ApiKeyInfo {
  key: string;
  usageCount: number;
  maxUsage: number;
}

// Function to get API keys from environment variables or use defaults
const getApiKeysFromEnv = (): ApiKeyInfo[] => {
  // Check if keys are defined in environment variables
  if (import.meta.env.VITE_IMAGEPIG_API_KEYS) {
    const envKeys = import.meta.env.VITE_IMAGEPIG_API_KEYS.split(',');
    return envKeys.map((key: string) => ({
      key: key.trim(),
      usageCount: 0,
      maxUsage: 29 // Setting to 29 to be safe with 30 request limit
    }));
  }
  
  // Fallback to hardcoded keys if environment variables are not available
  return [
    {
      key: "9c670150-ced2-4e4a-a657-41f11b44c4f3",
      usageCount: 0,
      maxUsage: 29
    },
    {
      key: "659d3d2a-552a-4a72-a546-bb6090468d06",
      usageCount: 0,
      maxUsage: 29
    },
    {
      key: "aa8d0b3f-5521-4f24-9362-5c002a0b4aad",
      usageCount: 0,
      maxUsage: 29
    },
    {
      key: "b4007be6-b260-41ed-bd59-54729705c6c0",
      usageCount: 0,
      maxUsage: 29
    }
  ];
};

// Initialize API keys
const API_KEYS: ApiKeyInfo[] = getApiKeysFromEnv();

// Current key index (start with the first key)
let currentKeyIndex = 0;

// Function to get the next API key in sequence with usage tracking
const getNextApiKey = (): string => {
  // If all keys are exhausted, reset usage counts
  if (API_KEYS.length === 0 || currentKeyIndex >= API_KEYS.length) {
    console.warn("All API keys have reached their usage limits. Resetting usage counts.");
    API_KEYS.forEach(keyInfo => {
      keyInfo.usageCount = 0;
    });
    currentKeyIndex = 0;
  }
  
  // Get the current key info
  const keyInfo = API_KEYS[currentKeyIndex];
  
  // Increment usage count
  keyInfo.usageCount++;
  
  // Log usage for debugging
  console.log(`Using API key: ${keyInfo.key.substring(0, 8)}... (${keyInfo.usageCount}/${keyInfo.maxUsage})`);
  
  // If the key has reached its usage limit, move to the next key
  if (keyInfo.usageCount >= keyInfo.maxUsage) {
    console.log(`API key ${keyInfo.key.substring(0, 8)}... has reached its usage limit. Moving to next key.`);
    currentKeyIndex++;
  }
  
  return keyInfo.key;
};

/**
 * Generates an image based on the canvas drawing and optional user prompt
 * 1. Analyzes canvas using Gemini to create a detailed image generation prompt
 * 2. Sends that prompt to ImagePig API to generate the actual image
 */
export const generateImageFromCanvas = async (
  imageData: string,
  userPrompt: string = ""
): Promise<{
  success: boolean;
  message: string;
  imageUrl?: string; 
  generatedPrompt?: string;
  imageBase64?: string;
}> => {
  try {
    // STEP 1: Generate prompt using Gemini
    const prompt = await generatePromptFromCanvas(imageData, userPrompt);
    
    if (!prompt || prompt.startsWith("Error")) {
      return {
        success: false,
        message: prompt || "Failed to generate image prompt"
      };
    }
    
    console.log("Generated prompt:", prompt);
    
    // STEP 2: Generate image using ImagePig API
    const imageResult = await generateImageWithImagePig(prompt);
    
    if (!imageResult.success) {
      return imageResult;
    }
    
    return {
      success: true,
      message: "Image generated successfully!",
      imageUrl: imageResult.imageUrl,
      imageBase64: imageResult.imageBase64,
      generatedPrompt: prompt
    };
    
  } catch (error: any) {
    console.error('Error in image generation process:', error);
    return {
      success: false,
      message: "Error generating image: " + (error?.message || "Unknown error")
    };
  }
};

/**
 * Uses Gemini to analyze the canvas and generate an image prompt
 */
const generatePromptFromCanvas = async (
  imageData: string,
  userPrompt: string = ""
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

    // Create a system prompt for generating image prompts
    const systemPrompt = 
  "You are an expert in text-to-image prompt engineering. " +
  "Carefully analyze the uploaded sketch or drawing and create a concise, detailed prompt that will generate a high-quality, fully detailed, full-sized image that closely resembles and refines the sketch. " +
  "Your goal is to turn the sketch into a realistic or artistic version while preserving its original layout, subject, and composition. " +
  "IMPORTANT: Prioritize the user's exact requests and guidance where given, and treat them as mandatory. " +
  "Focus on style, subject, composition, colors, mood, and completeness. " +
  "Do NOT let the image appear cropped, incomplete, or different in structure from the sketch. " +
  "Limit the output to 75 words, and return only the generation prompt without any extra text or explanation.";


    // Create the inputs array - include user prompt if provided
    const inputs = userPrompt 
      ? [systemPrompt, `The user has provided this specific request: "${userPrompt}" - Make sure to incorporate these requirements prominently in your prompt along with the sketch.`, imageFileData]
      : [systemPrompt, imageFileData];

    // Generate the prompt
    const result = await model.generateContent(inputs);
    const generatedPrompt = await result.response.text().trim();
    
    return generatedPrompt;
    
  } catch (error: any) {
    console.error('Error generating prompt from canvas:', error);
    return "Error generating image prompt: " + (error?.message || "Unknown error");
  }
};

/**
 * Calls ImagePig API to generate an image from a prompt
 * Uses sequential API keys with usage tracking
 */
const generateImageWithImagePig = async (prompt: string): Promise<{
  success: boolean;
  message: string;
  imageUrl?: string;
  imageBase64?: string;
}> => {
  try {
    // Get the next API key in the sequence
    const apiKey = getNextApiKey();
    
    // Call the ImagePig API
    const response = await fetch('https://api.imagepig.com/xl', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': apiKey
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      // If we get a rate limit error, try with the next key immediately
      if (response.status === 429) {
        console.log("Rate limit hit, trying with next key...");
        
        // Force move to next key if current one hit rate limit
        if (currentKeyIndex < API_KEYS.length - 1) {
          currentKeyIndex++;
        } else {
          // If we're at the last key, go back to the first one
          currentKeyIndex = 0;
        }
        
        // Get a fresh key
        const nextApiKey = getNextApiKey();
        
        const retryResponse = await fetch('https://api.imagepig.com/xl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': nextApiKey
          },
          body: JSON.stringify({ prompt })
        });
        
        if (!retryResponse.ok) {
          throw new Error(`ImagePig API error on retry: ${retryResponse.status} - ${await retryResponse.text()}`);
        }
        
        const retryData = await retryResponse.json();
        if (retryData.image_data) {
          const imageBase64 = retryData.image_data;
          const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
          
          return {
            success: true,
            message: "Image generated successfully (retry)",
            imageUrl,
            imageBase64
          };
        }
      }
      
      throw new Error(`ImagePig API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    
    // The API returns base64 image data
    if (data.image_data) {
      // For browser display, we need to create a data URL
      const imageBase64 = data.image_data;
      const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
      
      return {
        success: true,
        message: "Image generated successfully",
        imageUrl,
        imageBase64
      };
    } else {
      throw new Error("No image data in the response");
    }
    
  } catch (error: any) {
    console.error('Error calling ImagePig API:', error);
    
    // For development, use a placeholder image if API call fails
    const placeholderId = Date.now().toString();
    return {
      success: false,
      message: "Error from image API: " + (error?.message || "Unknown error"),
      imageUrl: `https://picsum.photos/seed/${placeholderId}/800/600` // Fallback placeholder
    };
  }
}; 