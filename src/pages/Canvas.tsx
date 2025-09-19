import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Box } from '@mui/material';
import CanvasToolbar from '../components/canvas/CanvasToolbar';
import DrawingLayer from '../components/canvas/DrawingLayer';
import TextToolbox from '../components/canvas/TextToolbox';
import useDrawing from '../components/canvas/hooks/useDrawing';
import useHistory from '../components/canvas/hooks/useHistory';
import { TOOLS, Line, Shape, TextShape, Point } from '../components/canvas/types/canvas.types';
import { motion, AnimatePresence } from 'framer-motion';

// Add this declaration before the component
declare global {
  interface Window {
    debugPolygon: (id: string | number) => void;
  }
}

interface CanvasProps {
  width?: number;
  height?: number;
  darkMode?: boolean;
  onSave?: (imageData: string) => void;
}

// Define the ref type
interface CanvasRefHandle {
  stageRef: React.RefObject<any>;
}

const Canvas = forwardRef<CanvasRefHandle, CanvasProps>(({ 
  width, 
  height,
  darkMode: initialDarkMode = false,
  onSave 
}, ref) => {
  // State from custom hooks
  const {
    tool, setTool,
    lines, setLines,
    shapes, setShapes,
    texts, setTexts,
    color, setColor,
    brushSize, setBrushSize,
    eraserSize, setEraserSize,
    darkMode, setDarkMode,
    scale, setScale,
    position, setPosition,
    stageRef,
    textInputRef,
    textInputVisible, setTextInputVisible,
    textInputPosition, setTextInputPosition,
    currentText, setCurrentText,
    editingTextId, setEditingTextId,
    fontSize, setFontSize,
    alignment, setAlignment,
    fontStyle, setFontStyle,
    selectedText, setSelectedText,
    selectedTextId, setSelectedTextId,
  } = useDrawing(initialDarkMode);

  const {
    history,
    historyStep,
    saveToHistory,
    handleUndo,
    handleRedo,
  } = useHistory({ lines, shapes, texts, setLines, setShapes, setTexts });

  // Add state to track if the text toolbox is minimized
  const [textToolboxMinimized, setTextToolboxMinimized] = useState<boolean>(false);

  // Handle canvas clearing
  const handleClearCanvas = () => {
    setLines([]);
    setShapes([]);
    setTexts([]);
    saveToHistory();
  };

  // Export canvas as image
  const handleExportCanvas = () => {
    if (stageRef.current && onSave) {
      const dataURL = stageRef.current.toDataURL();
      onSave(dataURL);
    }
  };

  // Add this function to delete the selected text
  const handleDeleteSelectedText = () => {
    if (selectedText && selectedTextId) {
      setTexts(texts.filter(text => text.id !== selectedTextId));
      setSelectedText(null);
      setSelectedTextId(null);
      saveToHistory();
    }
  };

  // Initialize with history
  useEffect(() => {
    saveToHistory();
  }, []);

  // Add this effect to your Canvas component to ensure TextToolbox and DrawingLayer stay in sync
  useEffect(() => {
    // When properties change in TextToolbox, they should immediately affect text editing
    if (textInputVisible && textInputRef.current) {
      // Force textarea to update its styling
      textInputRef.current.style.fontSize = `${fontSize * scale}px`;
      textInputRef.current.style.fontFamily = fontStyle;
      textInputRef.current.style.textAlign = alignment;
      textInputRef.current.style.color = color;
    }
  }, [fontSize, fontStyle, alignment, color, textInputVisible, scale]);

  // Add a new method to the Canvas component
  const fillPolygon = (id: string | number) => {
    // Find polygon by ID
    const shape = shapes.find(s => s.id === id);
    
    if (shape && shape.type === TOOLS.POLYGON) {
      const newShapes = shapes.map(s => {
        if (s.id === id) {
          // Toggle the fill
          return {
            ...s,
            fill: s.fill === 'transparent' || !s.fill ? color : 'transparent' 
          };
        }
        return s;
      });
      
      setShapes(newShapes);
    }
  };

  // Add at the top - helps with visual debugging
  useEffect(() => {
    window.debugPolygon = (id) => {
      const shape = shapes.find(s => s.id === id);
      if (shape && shape.points) {
        console.log("POLYGON POINTS:", shape.points);
      }
    };
  }, [shapes]);

  // Boundary-aware flood fill implementation 
  const handleFill = (point: Point) => {
    if (!stageRef.current) return false;
    
    // Get the Konva stage
    const stage = stageRef.current;
    
    // Calculate correct pixel coordinates
    const clickX = Math.round((point.x - position.x) / scale);
    const clickY = Math.round((point.y - position.y) / scale);
    
    console.log("Fill at pixel:", clickX, clickY);
    
    // Export the current canvas as an image
    const dataURL = stage.toDataURL();
    
    // Create an image to work with
    const img = new Image();
    img.onload = () => {
      // Create a hidden canvas for pixel manipulation
      const canvas = document.createElement('canvas');
      canvas.width = stage.width();
      canvas.height = stage.height();
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) return;
      
      // Draw the current state of the drawing
      ctx.drawImage(img, 0, 0);
      
      // Get the pixel data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Get the target color (color we're replacing)
      const targetColorPos = (clickY * canvas.width + clickX) * 4;
      const targetColor = {
        r: imageData.data[targetColorPos],
        g: imageData.data[targetColorPos + 1],
        b: imageData.data[targetColorPos + 2],
        a: imageData.data[targetColorPos + 3]
      };
      
      // Prepare the replacement color
      const fillColorHex = color.replace('#', '');
      const fillColor = {
        r: parseInt(fillColorHex.substring(0, 2), 16),
        g: parseInt(fillColorHex.substring(2, 4), 16),
        b: parseInt(fillColorHex.substring(4, 6), 16),
        a: 255 // Fully opaque
      };
      
      // Boundary-aware flood fill algorithm
      boundarySensitiveFloodFill(imageData, clickX, clickY, targetColor, fillColor);
      
      // Put the filled image data back
      ctx.putImageData(imageData, 0, 0);
      
      // Convert the filled canvas back to an image
      const filledDataURL = canvas.toDataURL();
      
      // Create a new shape object to represent the filled area
      const fillLayer = {
        id: `fill-${Date.now()}`,
        type: TOOLS.RECTANGLE,
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        fill: 'transparent',
        stroke: 'transparent',
        strokeWidth: 0,
        customProps: {
          isFillLayer: true,
          fillImage: filledDataURL
        }
      };
      
      // Add the fill layer to our shapes
      setShapes([...shapes, fillLayer]);
      saveToHistory();
    };
    
    img.src = dataURL;
    return true;
  };

  // Specialized flood fill that detects color boundaries
  const boundarySensitiveFloodFill = (
    imageData: ImageData, 
    startX: number, 
    startY: number, 
    targetColor: {r: number, g: number, b: number, a: number}, 
    fillColor: {r: number, g: number, b: number, a: number}
  ) => {
    const width = imageData.width;
    const height = imageData.height;
    
    // Simple tolerance-based color comparison
    const colorMatches = (x: number, y: number, target: {r: number, g: number, b: number, a: number}) => {
      if (x < 0 || y < 0 || x >= width || y >= height) return false;
      
      const i = (y * width + x) * 4;
      const currentColor = {
        r: imageData.data[i],
        g: imageData.data[i + 1],
        b: imageData.data[i + 2],
        a: imageData.data[i + 3]
      };
      
      // Allow slight variation (for anti-aliased edges)
      const tolerance = 30;
      return Math.abs(currentColor.r - target.r) <= tolerance &&
             Math.abs(currentColor.g - target.g) <= tolerance &&
             Math.abs(currentColor.b - target.b) <= tolerance;
    };
    
    // Set pixel color
    const setColor = (x: number, y: number, color: {r: number, g: number, b: number, a: number}) => {
      const i = (y * width + x) * 4;
      imageData.data[i] = color.r;
      imageData.data[i + 1] = color.g;
      imageData.data[i + 2] = color.b;
      imageData.data[i + 3] = color.a;
    };
    
    // Use a queue-based approach to avoid recursion stack limits
    const queue: Array<[number, number]> = [];
    queue.push([startX, startY]);
    
    // Process the queue
    while (queue.length > 0) {
      const [x, y] = queue.shift()!;
      
      // Skip if already processed or not matching target color
      if (!colorMatches(x, y, targetColor)) continue;
      
      // Fill this pixel
      setColor(x, y, fillColor);
      
      // Add neighboring pixels to the queue (4-connected)
      queue.push([x + 1, y]);
      queue.push([x - 1, y]);
      queue.push([x, y + 1]);
      queue.push([x, y - 1]);
    }
  };

  // Expose the stageRef to parent components
  useImperativeHandle(ref, () => ({
    stageRef
  }));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        width: '100%',
        bgcolor: darkMode ? '#2E2E2E' : '#fafafa',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <CanvasToolbar 
        tool={tool}
        setTool={setTool}
        color={color}
        setColor={setColor}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        eraserSize={eraserSize}
        setEraserSize={setEraserSize}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        scale={scale}
        setScale={setScale}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        handleClearCanvas={handleClearCanvas}
        handleExportCanvas={handleExportCanvas}
        historyStep={historyStep}
        historyLength={history.length}
      />

      <AnimatePresence>
        {/* Only show when adding/editing text or when text is selected */}
        {((tool === TOOLS.TEXT && (textInputVisible || selectedText)) || (selectedText && tool === TOOLS.SELECT)) && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              // Collapse height when minimized
              height: textToolboxMinimized ? '40px' : 'auto',
              overflow: textToolboxMinimized ? 'hidden' : 'visible'
            }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'absolute', right: 20, top: 80, zIndex: 100 }}
          >
            <TextToolbox
              color={color}
              setColor={setColor}
              fontSize={fontSize}
              setFontSize={setFontSize}
              alignment={alignment}
              setAlignment={setAlignment}
              fontStyle={fontStyle}
              setFontStyle={setFontStyle}
              selectedText={selectedText}
              deleteSelectedText={handleDeleteSelectedText}
              tool={tool}
              minimized={textToolboxMinimized}
              setMinimized={setTextToolboxMinimized}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DrawingLayer
        stageRef={stageRef}
        textInputRef={textInputRef as React.RefObject<HTMLTextAreaElement>}
        tool={tool}
        lines={lines}
        shapes={shapes}
        texts={texts}
        setLines={setLines}
        setShapes={setShapes}
        setTexts={setTexts}
        color={color}
        brushSize={brushSize}
        eraserSize={eraserSize}
        scale={scale}
        position={position}
        setPosition={setPosition}
        darkMode={darkMode}
        textInputVisible={textInputVisible}
        setTextInputVisible={setTextInputVisible}
        textInputPosition={textInputPosition}
        setTextInputPosition={setTextInputPosition}
        currentText={currentText}
        setCurrentText={setCurrentText}
        editingTextId={editingTextId}
        setEditingTextId={setEditingTextId}
        fontSize={fontSize}
        fontStyle={fontStyle}
        alignment={alignment}
        selectedText={selectedText}
        setSelectedText={setSelectedText}
        selectedTextId={selectedTextId}
        setSelectedTextId={setSelectedTextId}
        saveToHistory={saveToHistory}
        setFontSize={setFontSize}
        setFontStyle={setFontStyle}
        setAlignment={setAlignment}
      />
    </Box>
  );
});

export default Canvas; 