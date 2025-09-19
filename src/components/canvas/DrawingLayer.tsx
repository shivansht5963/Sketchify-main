import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Line, Rect, Circle, Text, RegularPolygon, Image, Group } from 'react-konva';
import { Box, Button } from '@mui/material';
import { TOOLS, Line as LineType, Shape as ShapeType, TextShape as TextShapeType, Point, Shape } from './types/canvas.types';
import useCanvasEvents from './hooks/useCanvasEvents';
import Konva from 'konva';

interface DrawingLayerProps {
  stageRef: React.RefObject<any>;
  textInputRef: React.RefObject<HTMLTextAreaElement>;
  tool: TOOLS;
  lines: LineType[];
  shapes: ShapeType[];
  texts: TextShapeType[];
  setLines: (lines: LineType[]) => void;
  setShapes: (shapes: ShapeType[]) => void;
  setTexts: (texts: TextShapeType[]) => void;
  color: string;
  brushSize: number;
  eraserSize: number;
  scale: number;
  position: Point;
  setPosition: (position: Point) => void;
  darkMode: boolean;
  textInputVisible: boolean;
  setTextInputVisible: (visible: boolean) => void;
  textInputPosition: Point;
  setTextInputPosition: (position: Point) => void;
  currentText: string;
  setCurrentText: (text: string) => void;
  editingTextId: string | number | null;
  setEditingTextId: (id: string | number | null) => void;
  fontSize: number;
  fontStyle: string;
  alignment: string;
  selectedText: TextShapeType | null;
  setSelectedText: (text: TextShapeType | null) => void;
  selectedTextId: string | number | null;
  setSelectedTextId: (id: string | number | null) => void;
  saveToHistory: () => void;
  setFontSize: (size: number) => void;
  setFontStyle: (style: string) => void;
  setAlignment: (alignment: string) => void;
}

const DrawingLayer: React.FC<DrawingLayerProps> = ({
  stageRef,
  textInputRef,
  tool,
  lines,
  shapes,
  texts,
  setLines,
  setShapes,
  setTexts,
  color,
  brushSize,
  eraserSize,
  scale,
  position,
  setPosition,
  darkMode,
  textInputVisible,
  setTextInputVisible,
  textInputPosition,
  setTextInputPosition,
  currentText,
  setCurrentText,
  editingTextId,
  setEditingTextId,
  fontSize,
  fontStyle,
  alignment,
  selectedText,
  setSelectedText,
  selectedTextId,
  setSelectedTextId,
  saveToHistory,
  setFontSize,
  setFontStyle,
  setAlignment,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [stageSize, setStageSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight - 80 : 600
  });
  const [pointsBuffer, setPointsBuffer] = useState<number[]>([]);
  const speedBuffer = React.useRef<number[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const [touchStartPosition, setTouchStartPosition] = useState<Point | null>(null);

  // Get pointer position helper - moved to the top
  const getPointerPosition = () => {
    const stage = stageRef.current;
    if (!stage) return null;
    
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return null;
    
    return {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY()
    };
  };

  // Replace handleFill with this advanced version
  const handleFill = (point: Point) => {
    const stage = stageRef.current;
    if (!stage) return;
    
    // First, try direct shape intersection
    const shape = stage.getIntersection(stage.getPointerPosition());
    
    // If we clicked on a standard shape, fill it directly
    if (shape && shape.attrs && 
        shape.className !== 'Stage' && 
        shape.className !== 'Layer' && 
        shape.className !== 'Line') {
      shape.fill(color);
      stage.batchDraw();
      saveToHistory();
      return;
    }
    
    // For pen strokes or complicated shapes, use a pixel-based approach
    // Create an off-screen canvas to analyze the pixels
    const offScreenCanvas = document.createElement('canvas');
    const ctx = offScreenCanvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    offScreenCanvas.width = stageSize.width;
    offScreenCanvas.height = stageSize.height;
    
    // Draw a white background to ensure transparency is handled correctly
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, offScreenCanvas.width, offScreenCanvas.height);
    
    // Draw just the lines/strokes to a temporary canvas for analysis
    const tempLayer = new Konva.Layer();
    stage.add(tempLayer);
    
    // Add all lines/strokes to the temporary layer
    lines.forEach(line => {
      if (line.tool === TOOLS.PEN) {
        const konvaLine = new Konva.Line({
          points: line.points,
          stroke: 'black', // Use black for better detection
          strokeWidth: line.strokeWidth,
          lineCap: 'round',
          lineJoin: 'round',
          bezier: true,
        });
        tempLayer.add(konvaLine);
      }
    });
    
    tempLayer.draw();
    
    // Convert the layer to an image
    const dataURL = tempLayer.toDataURL();
    const img = new window.Image();
    
    img.onload = () => {
      // Draw the lines image to our analysis canvas
      ctx.drawImage(img, 0, 0);
      
      // Now perform a flood fill at the clicked point
      // Adjusted for scale and position
      const scaledPoint = {
        x: Math.floor(point.x * scale),
        y: Math.floor(point.y * scale)
      };
      
      // Get the image data for analysis
      const imageData = ctx.getImageData(0, 0, offScreenCanvas.width, offScreenCanvas.height);
      
      // Create a separate canvas to visualize the fill
      const fillCanvas = document.createElement('canvas');
      fillCanvas.width = offScreenCanvas.width;
      fillCanvas.height = offScreenCanvas.height;
      const fillCtx = fillCanvas.getContext('2d');
      if (!fillCtx) return;
      
      // Perform flood fill
      const targetR = 255, targetG = 255, targetB = 255; // White (background color)
      const fillColorRgb = hexToRgb(color);
      
      // Set fill tolerance (0-255)
      const tolerance = 30;
      
      // Stack-based flood fill
      const stack = [{x: scaledPoint.x, y: scaledPoint.y}];
      const width = imageData.width;
      const height = imageData.height;
      const visited = new Set(); // Track visited pixels
      
      while (stack.length > 0 && visited.size < 1000000) { // Limit to prevent browser hang
        const current = stack.pop()!;
        const pixelPos = (current.y * width + current.x) * 4;
        
        // Skip if out of bounds
        if (current.x < 0 || current.y < 0 || current.x >= width || current.y >= height) {
          continue;
        }
        
        // Skip if already visited
        const pixelKey = `${current.x},${current.y}`;
        if (visited.has(pixelKey)) {
          continue;
        }
        
        // Get current pixel color
        const r = imageData.data[pixelPos];
        const g = imageData.data[pixelPos + 1];
        const b = imageData.data[pixelPos + 2];
        
        // Check if it's background color (with tolerance)
        if (Math.abs(r - targetR) <= tolerance &&
            Math.abs(g - targetG) <= tolerance &&
            Math.abs(b - targetB) <= tolerance) {
          
          // Fill this pixel
          visited.add(pixelKey);
          fillCtx.fillStyle = color;
          fillCtx.fillRect(current.x, current.y, 1, 1);
          
          // Add neighboring pixels to check
          stack.push({x: current.x + 1, y: current.y});
          stack.push({x: current.x - 1, y: current.y});
          stack.push({x: current.x, y: current.y + 1});
          stack.push({x: current.x, y: current.y - 1});
        }
      }
      
      // Now add our filled area as a new shape
      const fillImage = new window.Image();
      fillImage.onload = () => {
        // Add a new shape that's the filled area
        const newShape = {
          id: Date.now(),
          type: TOOLS.RECTANGLE,
          x: 0,
          y: 0,
          width: stageSize.width / scale,
          height: stageSize.height / scale,
          color: 'transparent',
          strokeWidth: 0,
          fill: 'transparent',
          customProps: {
            isFillLayer: true,
            fillImage: fillImage.src
          }
        };
        
        // Insert at beginning so it's behind other elements
        setShapes([newShape, ...shapes]);
        saveToHistory();
      };
      
      // Set the image source to our filled canvas
      fillImage.src = fillCanvas.toDataURL();
      
      // Remove the temporary layer
      tempLayer.destroy();
    };
    
    img.src = dataURL;
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Now call useCanvasEvents
  const {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useCanvasEvents({
    stageRef,
    tool,
    isDrawing,
    setIsDrawing,
    lines,
    setLines,
    shapes,
    setShapes,
    color,
    brushSize,
    eraserSize,
    scale,
    position,
    setPosition,
    setScale: (newScale) => {}, // This would be passed from parent
    getPointerPosition,
    pointsBuffer,
    setPointsBuffer,
    speedBuffer,
    saveToHistory,
    isPanning,
    setIsPanning,
    touchStartPosition,
    setTouchStartPosition,
    textInputVisible,
    setTextInputVisible,
    editingTextId,
    handleFill,
  });

  // Text handling methods
  const finishTextEditing = () => {
    if (currentText.trim() !== '') {
      const newText = {
        id: editingTextId || Date.now(),
        x: textInputPosition.x,
        y: textInputPosition.y,
        text: currentText,
        fontSize: fontSize,
        fontFamily: fontStyle,
        fill: color,
        draggable: true,
        align: alignment,
      };

      if (editingTextId) {
        setTexts(texts.map(text => text.id === editingTextId ? newText : text));
      } else {
        setTexts([...texts, newText]);
      }
      saveToHistory();
    }
    setTextInputVisible(false);
    setEditingTextId(null);
  };

  const cancelTextEditing = () => {
    setTextInputVisible(false);
    setEditingTextId(null);
    setSelectedText(null);
  };

  const handleTextSubmit = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishTextEditing();
    } else if (e.key === 'Escape') {
      cancelTextEditing();
    }
  };

  // Custom cursor based on the current tool
  const getCursor = () => {
    switch(tool) {
      case TOOLS.PEN:
        // Enforce minimum size of 10px for cursor
        const visibleSize = Math.max(10, brushSize);
        const cursor = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${visibleSize}" height="${visibleSize}" viewBox="0 0 ${visibleSize} ${visibleSize}">
            <circle 
              cx="${visibleSize/2}" 
              cy="${visibleSize/2}" 
              r="${(visibleSize/2) - 1}" 
              fill="${color}"
              stroke="white"
              stroke-width="1"
            />
          </svg>
        `;
        const encoded = encodeURIComponent(cursor);
        return `url('data:image/svg+xml;utf8,${encoded}') ${visibleSize/2} ${visibleSize/2}, auto`;
      case TOOLS.ERASER:
        const eraserCursor = `
          <svg xmlns="http://www.w3.org/2000/svg" width="${eraserSize}" height="${eraserSize}" viewBox="0 0 ${eraserSize} ${eraserSize}">
            <rect width="${eraserSize-2}" height="${eraserSize-2}" x="1" y="1" fill="white" stroke="black"/>
          </svg>
        `;
        const encodedEraser = encodeURIComponent(eraserCursor);
        return `url('data:image/svg+xml;utf8,${encodedEraser}') ${eraserSize/2} ${eraserSize/2}, auto`;
      case TOOLS.SELECT:
        return 'pointer';
      case TOOLS.TEXT:
        return 'text';
      case TOOLS.FILL:
        const fillCursor = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="${color}" d="M19.228,18.732l1.767-1.768c0.954-0.954,0.954-2.5,0-3.454L10.464,3
              L9.05,4.414L5.636,8l-1.4,5.6l5.6,5.6l5.6-1.4l3.792-3.792L19.228,18.732z M6.649,14.013l1.228-4.421l3.34,3.34l-4.568,1.08
              L6.649,14.013z M13.492,16.421L7.579,10.87L14,4.67l6.421,6.164L13.492,16.421z M21,20c0,0.552-0.448,1-1,1s-1-0.448-1-1
              s0.448-1,1-1S21,19.448,21,20z"/>
          </svg>
        `;
        const encodedFill = encodeURIComponent(fillCursor);
        return `url('data:image/svg+xml;utf8,${encodedFill}') 0 24, auto`;
      default:
        return 'crosshair';
    }
  };

  // Update stage size on window resize
  useEffect(() => {
    const handleResize = () => {
      setStageSize({
        width: window.innerWidth,
        height: window.innerHeight - 80
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update text handling inside DrawingLayer component
  const handleTextSelect = (text: TextShapeType) => {
    if (tool === TOOLS.TEXT || tool === TOOLS.SELECT) {
      setSelectedText(text);
      setSelectedTextId(text.id);
      // Set current text properties to match selected text
      setFontSize(text.fontSize);
      setAlignment(text.align);
      setFontStyle(text.fontFamily);
    }
  };

  // Add this function to directly update the textarea styling
  const updateTextareaStyles = () => {
    if (textInputRef.current) {
      textInputRef.current.style.fontSize = `${fontSize * scale}px`;
      textInputRef.current.style.fontFamily = fontStyle;
      textInputRef.current.style.textAlign = alignment;
      textInputRef.current.style.color = color;
    }
  };

  // Call this function every time properties change
  useEffect(() => {
    if (textInputVisible) {
      updateTextareaStyles();
    }
  }, [fontSize, fontStyle, alignment, color, scale, textInputVisible]);

  // Also call it when the textarea first appears
  useEffect(() => {
    if (textInputVisible) {
      updateTextareaStyles();
      if (textInputRef.current) {
        textInputRef.current.focus();
      }
    }
  }, [textInputVisible]);

  // Function to force update the textarea styles
  const forceUpdateTextarea = () => {
    if (textInputRef.current) {
      const textarea = textInputRef.current;
      textarea.style.fontSize = `${fontSize * scale}px`;
      textarea.style.fontFamily = fontStyle;
      textarea.style.textAlign = alignment as any;
      textarea.style.color = color;
      
      // Force a repaint to ensure styles take effect immediately
      textarea.style.display = 'none';
      void textarea.offsetHeight; // Trigger reflow
      textarea.style.display = 'block';
    }
  };

  // Effect to update textarea on any property change
  useEffect(() => {
    if (textInputVisible) {
      forceUpdateTextarea();
    }
  }, [fontSize, fontStyle, alignment, color, textInputVisible, scale]);

  // Effect to focus and update when textarea becomes visible
  useEffect(() => {
    if (textInputVisible) {
      setTimeout(() => {
        if (textInputRef.current) {
          textInputRef.current.focus();
          forceUpdateTextarea();
        }
      }, 10); // Small delay to ensure DOM is ready
    }
  }, [textInputVisible]);

  // Add this function in the DrawingLayer component
  const handleShapeClick = (id: string | number) => {
    if (tool === TOOLS.FILL) {
      // Assuming you have a fillShape function that accepts an id
      const shape = shapes.find(s => s.id === id);
      if (shape) {
        const newShapes = [...shapes];
        const index = newShapes.findIndex(s => s.id === id);
        if (index !== -1) {
          newShapes[index] = {
            ...newShapes[index],
            fill: newShapes[index].fill === 'transparent' || !newShapes[index].fill 
              ? color 
              : 'transparent'
          };
          setShapes(newShapes);
          saveToHistory();
        }
      }
    }
  };

  // Define a dedicated polygon fill handler
  const handlePolygonFill = (shape: Shape) => {
    console.log("Filling polygon:", shape.id);
    
    // Create a new version of shapes array
    const newShapes = shapes.map(s => {
      if (s.id === shape.id) {
        console.log("Found shape to fill");
        return {
          ...s,
          fill: s.fill === 'transparent' || !s.fill ? color : 'transparent'
        };
      }
      return s;
    });
    
    console.log("New fill:", newShapes.find(s => s.id === shape.id)?.fill);
    
    // Update shapes
    setShapes(newShapes);
    saveToHistory();
  };

  return (
    <Box 
      sx={{ 
        flex: 1,
        position: 'relative',
        backgroundColor: darkMode ? '#2E2E2E' : '#ffffff',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
        '&:focus': {
          outline: 'none',
        },
      }}
      tabIndex={0}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDblClick={(e) => {
          // Handle double click for text tool
          if (tool === TOOLS.TEXT) {
            const pos = getPointerPosition();
            if (pos) {
              setTextInputPosition(pos);
              setTextInputVisible(true);
              setCurrentText('');
              setEditingTextId(null);
              setSelectedText(null);
              if (textInputRef.current) {
                textInputRef.current.focus();
              }
            }
          }
        }}
        style={{ 
          cursor: getCursor(),
          touchAction: 'none' // Prevent default touch actions for better drawing
        }}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable={tool === TOOLS.SELECT}
        onClick={(e) => {
          if (tool === TOOLS.FILL) {
            // Get the clicked shape (if any)
            const shape = e.target;
            
            // Log what we clicked on
            console.log("CLICKED ON:", shape);
            
            // If we clicked on a shape with a fill property
            if (shape && shape !== e.currentTarget) {
              console.log("Filling shape:", shape.id());
              
              // Don't directly manipulate the Konva shape - only update React state
              const shapeId = shape.id();
              
              // Update React state only - this will properly persist
              const updatedShapes = shapes.map(s => {
                if (s.id.toString() === shapeId) {
                  const newFill = s.fill === 'transparent' || !s.fill ? color : 'transparent';
                  console.log(`Updating shape ${shapeId} fill to ${newFill}`);
                  return {...s, fill: newFill};
                }
                return s;
              });
              
              // Set the state and save to history
              setShapes(updatedShapes);
              saveToHistory();
              
              // Cancel the event to prevent bubbling
              e.cancelBubble = true;
            } else {
              // Clicked on the background - create a background color layer
              const backgroundFill = {
                id: `bg-${Date.now()}`,
                type: TOOLS.RECTANGLE,
                x: 0,
                y: 0,
                width: stageSize.width,
                height: stageSize.height,
                fill: color,
                stroke: 'transparent',
                strokeWidth: 0
              };
              
              // Add it at the beginning of the shapes array so it's behind everything
              setShapes([backgroundFill, ...shapes]);
              saveToHistory();
            }
          }
        }}
      >
        <Layer>
          {/* Render shapes */}
          {shapes.map((shape, i) => {
            // Only create shapeProps for shapes that need them
            const shapeProps = {
              key: i,
              x: shape.x,
              y: shape.y,
              stroke: shape.stroke || shape.color,
              strokeWidth: shape.strokeWidth || brushSize,
              fill: shape.fill || 'transparent',
              draggable: tool === TOOLS.SELECT,
              onDragEnd: () => saveToHistory(),
              onClick: () => handleShapeClick(shape.id || i),
              onTap: () => handleShapeClick(shape.id || i)
            };

            // Handle custom fill layer with image
            if (shape.customProps?.isFillLayer && shape.customProps?.fillImage) {
              const imageObj = new window.Image();
              imageObj.src = shape.customProps.fillImage;
              return (
                <Image
                  key={i}
                  x={0}
                  y={0}
                  image={imageObj}
                  width={stageSize.width}
                  height={stageSize.height}
                  listening={false}
                />
              );
            }

            // Properly handle different shape types with safe checks for properties
            if (shape.type === TOOLS.LINE) {
              return (
                <Line
                  {...shapeProps}
                  points={[0, 0, shape.width || 0, shape.height || 0]}
                  lineCap="round"
                />
              );
            } else if (shape.type === TOOLS.RECTANGLE) {
              return (
                <Rect
                  {...shapeProps}
                  width={shape.width || 0}
                  height={shape.height || 0}
                />
              );
            } else if (shape.type === TOOLS.CIRCLE) {
              return (
                <Circle
                  {...shapeProps}
                  radius={Math.abs((shape.width || 0) / 2)}
                />
              );
            } else if (shape.type === TOOLS.TRIANGLE) {
              return (
                <RegularPolygon
                  {...shapeProps}
                  sides={3}
                  radius={Math.abs((shape.width || 0) / 2)}
                />
              );
            } else if (shape.type === TOOLS.POLYGON) {
              return (
                <Line
                  key={i}
                  points={shape.points || []}
                  fill={shape.fill || 'transparent'}
                  stroke={shape.stroke || shape.color || color}
                  strokeWidth={shape.strokeWidth || brushSize}
                  closed={true}
                  perfectDrawEnabled={false}
                  hitStrokeWidth={20}
                  listening={true}
                  onClick={(e) => {
                    console.log("DIRECT POLYGON CLICK DETECTED", shape.id);
                    if (tool === TOOLS.FILL) {
                      e.cancelBubble = true;
                      e.evt.stopPropagation();
                      
                      const updatedShapes = [...shapes];
                      const index = updatedShapes.findIndex(s => s.id === shape.id);
                      
                      if (index !== -1) {
                        console.log("Found shape to fill at index", index);
                        updatedShapes[index] = {
                          ...updatedShapes[index],
                          fill: updatedShapes[index].fill === 'transparent' || !updatedShapes[index].fill 
                            ? color 
                            : 'transparent'
                        };
                        
                        console.log("Setting new fill:", updatedShapes[index].fill);
                        setShapes(updatedShapes);
                        saveToHistory();
                      }
                    }
                  }}
                />
              );
            } else if (shape.type === TOOLS.POLYGON_HIT) {
              return (
                <Line
                  key={i}
                  points={shape.points || []}
                  fill="rgba(0,0,0,0.01)" // Almost transparent fill so hit detection works
                  stroke="transparent"
                  strokeWidth={20}
                  closed={true}
                  listening={true}
                  onClick={(e) => {
                    console.log("Hit polygon clicked!", shape.hitPolygonId);
                    e.cancelBubble = true;
                    
                    if (tool === TOOLS.FILL) {
                      // Find the actual display polygon using the reference ID
                      const displayPolygon = shapes.find(s => s.id === shape.hitPolygonId);
                      if (displayPolygon) {
                        // Update the display polygon
                        const updatedShapes = shapes.map(s => 
                          s.id === displayPolygon.id 
                            ? {...s, fill: s.fill === 'transparent' || !s.fill ? color : 'transparent'} 
                            : s
                        );
                        
                        setShapes(updatedShapes);
                        saveToHistory();
                      }
                    }
                  }}
                />
              );
            }
            return null;
          })}

          {/* Render lines (pen strokes and eraser marks) */}
          {lines.map((line, i) => (
            <Line
              key={i}
              points={line.points}
              stroke={line.color}
              strokeWidth={line.strokeWidth}
              lineCap="round"
              lineJoin="round"
              tension={line.tool === TOOLS.PEN ? 0.3 : 0} // No tension for regular lines
              bezier={line.tool === TOOLS.PEN}
              globalCompositeOperation={
                line.tool === TOOLS.ERASER ? 'destination-out' : 'source-over'
              }
            />
          ))}

          {/* Render text elements */}
          {texts.map((text, i) => (
            <Text
              key={i}
              id={text.id.toString()}
              x={text.x}
              y={text.y}
              text={text.text}
              fontSize={text.fontSize}
              fill={text.fill}
              fontFamily={text.fontFamily}
              align={text.align}
              draggable={tool === TOOLS.SELECT}
              onClick={(e) => {
                handleTextSelect(text);
                  e.evt.cancelBubble = true;
              }}
              onDblClick={(e) => {
                if (tool === TOOLS.SELECT || tool === TOOLS.TEXT) {
                  setTextInputPosition({ x: text.x, y: text.y });
                  setCurrentText(text.text);
                  setTextInputVisible(true);
                  setEditingTextId(text.id);
                  handleTextSelect(text);
                  e.evt.cancelBubble = true;
                  if (textInputRef.current) {
                    textInputRef.current.focus();
                  }
                }
              }}
              onDragEnd={(e) => {
                const newTexts = [...texts];
                const index = newTexts.findIndex(t => t.id === text.id);
                if (index !== -1) {
                  newTexts[index] = {
                    ...newTexts[index],
                    x: e.target.x(),
                    y: e.target.y(),
                  };
                  setTexts(newTexts);
                  saveToHistory();
                }
              }}
              stroke={selectedTextId === text.id ? '#1976d2' : undefined}
              strokeWidth={selectedTextId === text.id ? 1 : undefined}
              strokeScaleEnabled={false}
            />
          ))}
        </Layer>
      </Stage>

      {/* Text input for editing/creating text */}
      {textInputVisible && (
        <>
        <textarea
          ref={textInputRef}
          value={currentText}
          onChange={(e) => {
            setCurrentText(e.target.value);
            // Auto-adjust height
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          onKeyDown={handleTextSubmit}
          style={{
            position: 'absolute',
            top: textInputPosition.y * scale + position.y,
            left: textInputPosition.x * scale + position.x,
            fontSize: `${fontSize * scale}px`,
            fontFamily: fontStyle,
            textAlign: alignment as any,
              color: color,
            border: '2px solid #1976d2',
            borderRadius: '4px',
            padding: '4px',
            minWidth: '100px',
            minHeight: '30px',
            zIndex: 1000,
            backgroundColor: darkMode ? '#333' : '#fff',
            resize: 'none',
            overflow: 'hidden',
            outline: 'none',
          }}
          autoFocus
        />
        </>
      )}
    </Box>
  );
};

export default DrawingLayer; 