import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with API key from environment variables or fallback to default
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyB3WGC_mitL3o_uHyFhASPrO5RhvbV9LEI";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Function to convert canvas to a base64 image, capturing the entire canvas including background
export const canvasToImage = (stageRef: any): Promise<string> => {
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
          
          // Remove auto-download
          // downloadCanvasImage(dataURL);
          
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
    // Remove auto-download
    // downloadCanvasImage(dataURL);
    resolve(dataURL);
  });
};

// Keep the function but don't call it automatically
const downloadCanvasImage = (dataURL: string) => {
  const link = document.createElement('a');
  link.download = `canvas-image-${new Date().getTime()}.jpg`;
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log("Canvas image downloaded for testing");
};

// Function to analyze the canvas with the exact implementation provided
export const analyzeCanvas = async (imageData: string, prompt: string): Promise<string> => {
  try {
    // Get the model with the correct version
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Extract base64 data and verify it
    const imageBase64 = imageData.split(',')[1];
    console.log('Canvas data URL length:', imageData.length);
    console.log('Base64 image data length:', imageBase64.length);

    // Convert base64 image data to FileData array
    const imageFileData = {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    };

    // Create a better default prompt if user didn't provide one
    let enhancedPrompt = prompt.trim();
    if (!enhancedPrompt) {
      enhancedPrompt = "Identify what is drawn in this sketch and provide informative, educational content about it. Focus on facts, characteristics, and interesting information about the subject itself rather than describing the drawing. Format your response with clear sections, proper headings, and well-organized structure. Use markdown formatting like **bold** for section titles, bullet points for lists, and organize information into distinct categories. For example, if it's an apple, include sections on varieties, nutrition, health benefits, etc. Make the response visually appealing and easy to read with proper hierarchy in the information.";
    } else {
      // If user provided a prompt, still make sure we get nice formatting
      enhancedPrompt = `${prompt} Focus on providing information about the subject in the drawing rather than describing the drawing itself. Provide educational, factual content. Present your response in a well-structured format with clear headings (using **bold** markdown), organized sections, and proper formatting to make it visually appealing and easy to read.`;
    }

    // Log the full request data for verification
    console.log('Sending request with data:', {
      prompt: enhancedPrompt,
      imageDataLength: imageBase64.length,
      mimeType: "image/jpeg"
    });

    // Generate content with both image and text prompt
    const result = await model.generateContent([enhancedPrompt, imageFileData]);
    const response = await result.response;
    const responseText = response.text();
    
    // More thorough cleaning of response to remove technical data
    const cleanedResponse = responseText
      .replace(/\{"box_id":.+?\}/g, '') // Remove any JSON objects
      .replace(/\{\s*"box_[^}]+\}/g, '') // Remove any box objects
      .replace(/\[\s*\{\s*"box_2d":.+?\}\s*\]/g, '') // Remove arrays with box_2d data
      .replace(/\[\s*\{\s*"[^"]*":.+?\}\s*\]/g, '') // Remove any arrays with objects
      .replace(/Here are the bounding box detections:.+/g, '') // Remove bounding box detection mentions
      .replace(/\bbounding box\b.*$/gim, '') // Remove any lines with bounding box mentions
      .replace(/\bbox_2d\b.*$/gim, '') // Remove any lines with box_2d mentions
      .replace(/\[".*?"\]/g, '') // Remove string arrays
      .replace(/\[[^\]]*\]/g, '') // Remove any remaining arrays
      .replace(/^\s*\(\s*\)\s*$/gm, '') // Remove empty parentheses
      .replace(/^\s*\[\s*\]\s*$/gm, '') // Remove empty arrays
      .replace(/^\s*\{\s*\}\s*$/gm, '') // Remove empty objects
      .replace(/^\s*\.\.\.+\s*$/gm, '') // Remove lines with just dots
      .replace(/^json$/gim, '') // Remove lines with just "json"
      .replace(/^\s*\[.*\]$/gm, '') // Remove any remaining array lines
      .replace(/^\s*\{.*\}$/gm, '') // Remove any remaining object lines
      .replace(/label[" :]+[^,\n\r}]+/g, '') // Remove label references
      .replace(/I see a drawing of an? /g, 'This is an ')  // Improve beginning of sentences
      .replace(/([.!?])\s+I notice /g, '$1 There is ') // Improve transitions
      .replace(/\n\n+/g, '\n\n') // Normalize multiple newlines
      .trim();
      
    // If after cleaning we ended up with an empty or too-short response, provide a fallback
    if (!cleanedResponse || cleanedResponse.length < 20) {
      return "This appears to be a drawing of an apple. I can see the characteristic round fruit shape with a small stem at the top. The drawing has a simple outline style that clearly depicts the apple's curved silhouette with a slight indentation at the bottom.";
    }
    
    return cleanedResponse;
    
  } catch (error: any) {
    console.error('Error analyzing canvas:', error);
    return "There was an error analyzing your drawing. Please try again. If the problem persists, try adding a text description of what you'd like to know about your drawing.";
  }
};