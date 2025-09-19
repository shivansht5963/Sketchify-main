import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key from environment variables or fallback to default
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyB3WGC_mitL3o_uHyFhASPrO5RhvbV9LEI";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Interface for code generation result
 */
interface CodeGenerationResult {
  success: boolean;
  message: string;
  code?: {
    react?: string;
    html?: string;
    css?: string;
    javascript?: string;
    description?: string;
  };
}

/**
 * Generates UI component code based on the canvas drawing
 */
export const generateCodeFromCanvas = async (
  imageData: string,
  userPrompt: string = "",
  framework: string = "react"
): Promise<CodeGenerationResult> => {
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

    // Create a system prompt for code generation based on selected framework
    const systemPrompt = 
      "You are an expert UI developer who specializes in translating sketches into functional, visually appealing code. " +
      "Analyze the uploaded sketch/drawing and generate code for a UI component that matches what is drawn. " +
      "Your code should have these qualities: " +
      "1. Clean, modern, and professional UI design " +
      "2. Appropriate color schemes and typography " +
      "3. Responsive layout using modern CSS " +
      "4. Proper spacing, alignment, and visual hierarchy " +
      "5. Default styling that looks polished and complete " +
      
      "For React components: " +
      "- Use styled-components or CSS modules with clean, modern styling " +
      "- Apply proper padding, margins, and responsive design " +
      "- Include hover effects and transitions for interactive elements " +
      "- Use semantic HTML and maintain accessibility " +
      
      "For HTML/CSS/JS: " +
      "- Use modern CSS features like flexbox and grid " +
      "- Include a clean color palette with appropriate contrast " +
      "- Add subtle shadows, borders, or other design elements for visual depth " +
      "- Ensure proper spacing between elements " +
      
      "In both cases, ensure the UI component looks complete and professional, not just a basic wireframe implementation. " +
      "Generate both React and HTML/CSS/JS versions regardless of the framework selected. " +
      
      "Format your response in JSON with the following structure: " +
      "{ " +
      "\"description\": \"Description of the identified UI and implementation approach\", " +
      "\"react\": \"// React component code here\", " +
      "\"html\": \"<!-- HTML code here -->\", " +
      "\"css\": \"/* CSS code here */\", " +
      "\"javascript\": \"// JavaScript code here (if needed)\" " +
      "}";

    // Create the inputs array - include user prompt if provided
    const userGuidance = userPrompt 
      ? `The user has provided this guidance: ${userPrompt}. Additionally, they want the code in ${framework} format.`
      : `Generate the code in ${framework} format.`;
    
    const inputs = [systemPrompt, userGuidance, imageFileData];

    // Generate the code
    const result = await model.generateContent(inputs);
    const generatedResponse = await result.response.text().trim();
    
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(extractJsonFromText(generatedResponse));
      
      return {
        success: true,
        message: "Code generated successfully!",
        code: {
          react: parsedResponse.react || "",
          html: parsedResponse.html || "",
          css: parsedResponse.css || "",
          javascript: parsedResponse.javascript || "",
          description: parsedResponse.description || ""
        }
      };
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError, 'Response:', generatedResponse);
      
      // If JSON parsing fails, return the raw text
      return {
        success: true,
        message: "Code generated, but in non-JSON format.",
        code: {
          react: generatedResponse,
          html: "",
          css: "",
          description: "The model didn't return properly formatted JSON. The entire response is provided in the React code section."
        }
      };
    }
    
  } catch (error: any) {
    console.error('Error generating code from canvas:', error);
    return {
      success: false,
      message: "Error generating code: " + (error?.message || "Unknown error")
    };
  }
};

/**
 * Helper function to extract JSON from text that might have markdown or other content
 */
function extractJsonFromText(text: string): string {
  // Try to find JSON content between triple backticks or regular JSON
  const jsonRegex = /```(?:json)?\s*({[\s\S]*?})\s*```|({[\s\S]*})/;
  const match = text.match(jsonRegex);
  
  if (match) {
    // Return the first capture group that is defined (either from inside backticks or bare JSON)
    return match[1] || match[2];
  }
  
  // If no JSON-like content found, return the original text
  return text;
} 