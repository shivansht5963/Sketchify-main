import { useCallback, useEffect } from 'react';
import { TOOLS, Line, Shape, Point } from '../types/canvas.types';

interface UseCanvasEventsProps {
  stageRef: React.RefObject<any>;
  tool: TOOLS;
  isDrawing: boolean;
  setIsDrawing: (isDrawing: boolean) => void;
  lines: Line[];
  setLines: (lines: Line[]) => void;
  shapes: Shape[];
  setShapes: (shapes: Shape[]) => void;
  color: string;
  brushSize: number;
  eraserSize: number;
  scale: number;
  position: Point;
  setPosition: (position: Point) => void;
  setScale: (scale: number) => void;
  getPointerPosition: () => Point | null;
  pointsBuffer: number[];
  setPointsBuffer: (buffer: number[]) => void;
  speedBuffer: React.MutableRefObject<number[]>;
  saveToHistory: () => void;
  isPanning: boolean;
  setIsPanning: (isPanning: boolean) => void;
  touchStartPosition: Point | null;
  setTouchStartPosition: (position: Point | null) => void;
  textInputVisible: boolean;
  setTextInputVisible: (visible: boolean) => void;
  editingTextId: string | number | null;
  handleFill: (pos: Point) => void;
  // Add other necessary props
}

// Move these functions inside the component to avoid dependency issues
export default function useCanvasEvents({
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
  setScale,
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
  // Destructure other props
}: UseCanvasEventsProps) {
  
  // Move these functions inside the component to avoid dependency issues
  const isClosedShape = useCallback((points: number[]): boolean => {
    if (points.length < 4) return false; // Need at least 2 points
    
    const startX = points[0];
    const startY = points[1];
    const endX = points[points.length - 2];
    const endY = points[points.length - 1];
    
    // Check if the start and end points are close enough to consider it closed
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    // Be more lenient with the distance threshold
    return distance < 20; 
  }, []);

  const lineToPolygon = useCallback((line: Line): Shape => {
    return {
      id: `polygon-${Date.now()}`,
      type: TOOLS.POLYGON,
      x: 0,
      y: 0,
      points: line.points,
      fill: 'transparent',
      stroke: line.color,
      strokeWidth: line.strokeWidth
    };
  }, []);

  // Calculate speed for pressure sensitivity
  const calculateSpeed = (points: number[], index: number): number => {
    if (index < 2) return 0;
    const dx = points[index] - points[index - 2];
    const dy = points[index + 1] - points[index - 1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Mouse event handlers
  const handleMouseDown = useCallback((e: any) => {
    const pos = getPointerPosition();
    if (!pos) return;
    
    const stage = stageRef.current;
    if (!stage) return;
    
    // Check if clicking on the toolbox or outside text input
    if (e.evt && e.evt.target.closest('.text-toolbox')) {
      return;
    }
    
    // If text input is visible and clicking outside, finish editing
    if (textInputVisible && e.target === stage) {
      // Handle finishing text edit
      return;
    }
    
    if (tool === TOOLS.SELECT) {
      // Handle selection logic
    } else if (tool === TOOLS.LINE) {
      setIsDrawing(true);
      
      // Create a new line with just the starting point
      const newLine = {
        tool: TOOLS.LINE,
        points: [pos.x, pos.y], // Just starting point
        color: color,
        strokeWidth: brushSize / (stage?.scaleX() || 1),
      };
      setLines([...lines, newLine]);
    } else if (tool !== TOOLS.TEXT) {
      setIsDrawing(true);
      
      if (tool === TOOLS.PEN) {
        // Reset points buffer for new stroke
        setPointsBuffer([pos.x, pos.y]);
        const newLine = {
          tool,
          points: [pos.x, pos.y],
          color: color,
          // Enforce minimum stroke width of 10px
          strokeWidth: Math.max(10, brushSize) / stage.scaleX(),
        };
        setLines([...lines, newLine]);
      } else if (tool === TOOLS.ERASER) {
        const newLine = {
          tool,
          points: [pos.x, pos.y],
          color: '#ffffff',
          strokeWidth: eraserSize / stage.scaleX(),
        };
        setLines([...lines, newLine]);
      } else if (tool === TOOLS.FILL) {
        const pos = getPointerPosition();
        if (pos) {
          handleFill(pos);
          e.evt.cancelBubble = true;
        }
      } else {
        const newShape = {
          type: tool,
          x: pos.x,
          y: pos.y,
          width: 0,
          height: 0,
          id: Date.now(),
          color: color,
          strokeWidth: brushSize / stage.scaleX(),
        };
        setShapes([...shapes, newShape]);
      }
    }
  }, [tool, isDrawing, lines, shapes, color, brushSize, eraserSize, getPointerPosition, textInputVisible, editingTextId, handleFill]);

  const handleMouseMove = useCallback((e: any) => {
    if (!isDrawing) return;
    const pos = getPointerPosition();
    if (!pos) return;
    
    const stage = stageRef.current;
    if (!stage) return;
    
    if (tool === TOOLS.PEN) {
      // Add point to current stroke's buffer
      const newPoints = [...pointsBuffer, pos.x, pos.y];
      setPointsBuffer(newPoints);
      
      // Calculate speed for pressure sensitivity
      const speed = calculateSpeed(newPoints, newPoints.length - 2);
      speedBuffer.current.push(speed);
      
      if (speedBuffer.current.length > 5) {
        speedBuffer.current.shift();
      }

      const avgSpeed = speedBuffer.current.reduce((a, b) => a + b, 0) / speedBuffer.current.length;
      
      const maxSpeed = 10;
      const minWidth = Math.max(10, brushSize * 0.5);
      const maxWidth = Math.max(10, brushSize);
      const dynamicWidth = Math.max(
        minWidth,
        maxWidth - (avgSpeed / maxSpeed) * (maxWidth - minWidth)
      );

      // Update current line
      const lastLine = lines[lines.length - 1];
      const newLine = {
        ...lastLine,
        points: newPoints,
        strokeWidth: dynamicWidth,
      };

      const newLines = [...lines];
      newLines.splice(newLines.length - 1, 1, newLine);
      setLines(newLines);
    } else if (tool === TOOLS.ERASER) {
      // Regular eraser behavior
      const lastLine = lines[lines.length - 1];
      const newPoints = lastLine.points.concat([pos.x, pos.y]);
      
      const newLine = {
        ...lastLine,
        points: newPoints
      };
      
      const newLines = [...lines];
      newLines.splice(newLines.length - 1, 1, newLine);
      setLines(newLines);
    } else if (tool === TOOLS.LINE) {
      // For line tool, simply extend the current line
      const lastLine = lines[lines.length - 1];
      if (lastLine && lastLine.tool === TOOLS.LINE) {
        // Make a copy of the last line
        const newLines = [...lines];
        
        // Replace the last point with the current position
        // This creates a simple point-to-point line
        if (lastLine.points.length <= 2) {
          newLines[newLines.length - 1] = {
            ...lastLine,
            points: [...lastLine.points, pos.x, pos.y]
          };
        } else {
          // We already have 2 points, just update the end point
          const points = [...lastLine.points];
          points[points.length - 2] = pos.x;
          points[points.length - 1] = pos.y;
          
          newLines[newLines.length - 1] = {
            ...lastLine,
            points: points
          };
        }
        
        setLines(newLines);
      }
    } else if (tool !== TOOLS.SELECT && tool !== TOOLS.TEXT) {
      const lastShape = shapes[shapes.length - 1];
      const newShape = {
        ...lastShape,
        width: pos.x - lastShape.x,
        height: pos.y - lastShape.y
      };
      
      const newShapes = [...shapes];
      newShapes.splice(newShapes.length - 1, 1, newShape);
      setShapes(newShapes);
    }
  }, [isDrawing, tool, lines, shapes, pointsBuffer, brushSize, getPointerPosition]);

  const handleMouseUp = useCallback(() => {
    if (isDrawing) {
      if (tool === TOOLS.LINE) {
        const lastLine = lines[lines.length - 1];
        
        if (lastLine && lastLine.points.length >= 4) {
          const startX = lastLine.points[0];
          const startY = lastLine.points[1];
          const endX = lastLine.points[lastLine.points.length - 2];
          const endY = lastLine.points[lastLine.points.length - 1];
          
          const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
          
          if (distance < 30) {
            console.log("Creating closed polygon");
            
            // Create a proper closed polygon with EXPLICIT closing point
            const polygonPoints = [...lastLine.points];
            // Always add the closing point to ensure proper fill
            polygonPoints.push(startX, startY);
            
            // Calculate center point for the polygon (needed for proper hit detection)
            let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            for (let i = 0; i < polygonPoints.length; i += 2) {
              minX = Math.min(minX, polygonPoints[i]);
              maxX = Math.max(maxX, polygonPoints[i]);
              minY = Math.min(minY, polygonPoints[i+1]);
              maxY = Math.max(maxY, polygonPoints[i+1]);
            }
            
            // Create polygon shape with explicit center coordinates
            const displayPolygon = {
              id: `polygon-${Date.now()}`,
              type: TOOLS.POLYGON,
              x: (minX + maxX) / 2, // Use center X
              y: (minY + maxY) / 2, // Use center Y
              points: polygonPoints,
              fill: 'transparent',
              stroke: color,
              strokeWidth: brushSize / (stageRef.current?.scaleX() || 1)
            };
            
            // Remove the line
            const newLines = [...lines.slice(0, -1)];
            setLines(newLines);
            
            // Add polygon
            setShapes([...shapes, displayPolygon]);
          }
        }
      }
      
      setIsDrawing(false);
      setPointsBuffer([]); // Clear points buffer when stroke ends
      speedBuffer.current = []; // Clear speed buffer
      saveToHistory();
    }
  }, [isDrawing, tool, lines, shapes, setLines, setShapes, saveToHistory, color, brushSize, stageRef]);

  // Touch event handlers for mobile/tablet support
  const handleTouchStart = useCallback((e: any) => {
    if (e.evt.touches.length === 1) {
      // Single touch = drawing
      handleMouseDown(e);
    } else if (e.evt.touches.length === 2) {
      // Two finger touch = panning/zooming
      setIsPanning(true);
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      setTouchStartPosition({
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      });
    }
  }, [handleMouseDown, setIsPanning, setTouchStartPosition]);

  const handleTouchMove = useCallback((e: any) => {
    e.evt.preventDefault(); // Prevent scrolling
    
    if (e.evt.touches.length === 1 && !isPanning) {
      // Single touch = drawing
      handleMouseMove(e);
    } else if (e.evt.touches.length === 2 && isPanning && touchStartPosition) {
      // Two finger touch = panning/zooming
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];
      const currentCenterPoint = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2
      };
      
      // Calculate distance between touch points for pinch-to-zoom
      const startDistance = Math.sqrt(
        Math.pow(touch1.clientX - touch2.clientX, 2) +
        Math.pow(touch1.clientY - touch2.clientY, 2)
      );
      
      const currentDistance = Math.sqrt(
        Math.pow(e.evt.touches[0].clientX - e.evt.touches[1].clientX, 2) +
        Math.pow(e.evt.touches[0].clientY - e.evt.touches[1].clientY, 2)
      );
      
      // Pan
      const newPos = {
        x: position.x + (currentCenterPoint.x - touchStartPosition.x),
        y: position.y + (currentCenterPoint.y - touchStartPosition.y)
      };
      setPosition(newPos);
      
      // Zoom
      if (Math.abs(startDistance - currentDistance) > 50) {
        const newScale = currentDistance > startDistance 
          ? scale * 1.01 
          : scale * 0.99;
        setScale(newScale);
      }
      
      setTouchStartPosition(currentCenterPoint);
    }
  }, [handleMouseMove, isPanning, touchStartPosition, position, scale, setPosition, setScale]);

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    setTouchStartPosition(null);
    handleMouseUp();
  }, [handleMouseUp, setIsPanning, setTouchStartPosition]);

  // Set up event listeners
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    
    stage.on('mousedown touchstart', handleMouseDown);
    stage.on('mousemove touchmove', handleMouseMove);
    stage.on('mouseup touchend', handleMouseUp);
    
    return () => {
      stage.off('mousedown touchstart');
      stage.off('mousemove touchmove');
      stage.off('mouseup touchend');
    };
  }, [stageRef, handleMouseDown, handleMouseMove, handleMouseUp]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Tool shortcuts
      if (!e.ctrlKey && !e.altKey && !e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'v': /* select tool */ break;
          case 'p': /* pen tool */ break;
          case 'e': /* eraser tool */ break;
          // etc.
        }
      }

      // Control key combinations
      if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
          case 'z':
            e.preventDefault();
            // Undo/redo logic
            break;
          // etc.
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
} 