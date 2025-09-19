import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key from environment variables or fallback to default
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyB3WGC_mitL3o_uHyFhASPrO5RhvbV9LEI";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Reuse the canvas to image function from the AI assistant service
export const canvasToImage = async (stageRef: any): Promise<string> => {
  return new Promise((resolve) => {
    if (!stageRef.current) {
      resolve('');
      return;
    }
    
    // Force redraw to ensure all elements are rendered
    stageRef.current.draw();
    
    // Try multiple approaches to capture the canvas content properly
    try {
      // Get the native canvas element from Konva stage
      const nativeCanvas = stageRef.current.content.querySelector('canvas');
      if (nativeCanvas) {
        console.log("Using native canvas element for capture");
        
        // Create a new canvas to properly handle the drawing with background
        const captureCanvas = document.createElement('canvas');
        const ctx = captureCanvas.getContext('2d');
        
        // Set dimensions to match the stage
        captureCanvas.width = stageRef.current.width();
        captureCanvas.height = stageRef.current.height();
        
        // Check if ctx is not null before using it
        if (ctx) {
          // Fill with white background first
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, captureCanvas.width, captureCanvas.height);
          
          // Draw the stage content
          ctx.drawImage(nativeCanvas, 0, 0);
          
          // Get as JPEG for better compatibility
          const dataURL = captureCanvas.toDataURL('image/jpeg', 0.95);
          resolve(dataURL);
          return;
        }
      }
    } catch (err) {
      console.error("Error with native canvas capture:", err);
    }
    
    // Fallback to Konva's built-in method with enhanced options
    const dataURL = stageRef.current.toDataURL({
      pixelRatio: 3, // Higher quality
      mimeType: 'image/jpeg',
      quality: 1.0,
      backgroundColor: '#ffffff', // Force white background
      x: 0,
      y: 0,
      width: stageRef.current.width(),
      height: stageRef.current.height()
    });
    
    console.log("Using Konva toDataURL for capture (fallback)");
    resolve(dataURL);
  });
};

// Specialized function for math problem analysis
export const analyzeMathProblem = async (imageData: string, additionalContext: string = ""): Promise<string> => {
  try {
    // Get the model with the correct version
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Extract base64 data
    const imageBase64 = imageData.split(',')[1];
    
    // Prepare the image data
    const imageFileData = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    };

    // Create a math-focused prompt
    const mathPrompt = `You are an expert math teacher and solver. Please solve the math problem shown in this image with detailed step-by-step explanations. 
    
    ${additionalContext ? `Additional context: ${additionalContext}` : ''}
    
    Provide your solution in this format:
    1. First identify what type of math problem this is
    2. List the steps to solve it clearly and logically and strictly make sure that it is user friendly and human readable and no unnecessary tags or symbols are there in the solution.
    3. Provide the final answer clearly marked as "Solution: [answer]"
    
    If you see multiple problems, solve each one separately with its own steps and solution.`;

    // Generate content with both image and math prompt
    const result = await model.generateContent([mathPrompt, imageFileData]);
    const response = await result.response;
    return response.text();
    
  } catch (error: any) {
    console.error('Error analyzing math problem:', error);
    return "There was an error solving the math problem. Please try again. Error: " + (error?.message || "Unknown error");
  }
}; 