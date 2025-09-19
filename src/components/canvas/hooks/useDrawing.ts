import { useState, useRef, useCallback } from 'react';
import { Stage } from 'konva/lib/Stage';
import { TOOLS, Line, Shape, TextShape, Point } from '../types/canvas.types';

export default function useDrawing(initialDarkMode = false, saveToHistory?: () => void) {
  const [tool, setTool] = useState<TOOLS>(TOOLS.PEN);
  const [lines, setLines] = useState<Line[]>([]);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [texts, setTexts] = useState<TextShape[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#000000');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [eraserSize, setEraserSize] = useState<number>(20);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 });
  const [darkMode, setDarkMode] = useState<boolean>(initialDarkMode);
  const [stageSize, setStageSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 800,
    height: typeof window !== 'undefined' ? window.innerHeight : 600
  });
  
  // Text related state
  const [textInputVisible, setTextInputVisible] = useState<boolean>(false);
  const [textInputPosition, setTextInputPosition] = useState<Point>({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState<string>('');
  const [editingTextId, setEditingTextId] = useState<string | number | null>(null);
  const [fontSize, setFontSize] = useState<number>(20);
  const [alignment, setAlignment] = useState<string>('left');
  const [fontStyle, setFontStyle] = useState<string>('Comic Sans MS');
  const [selectedText, setSelectedText] = useState<TextShape | null>(null);
  const [selectedTextId, setSelectedTextId] = useState<string | number | null>(null);
  
  // Refs
  const stageRef = useRef<Stage | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement | null>(null);
  
  // Drawing buffers for smooth drawing
  const [pointsBuffer, setPointsBuffer] = useState<number[]>([]);
  const speedBuffer = useRef<number[]>([]);
  
  // For touch devices - track multi-touch events
  const [touchStartPosition, setTouchStartPosition] = useState<Point | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  
  // Get pointer position from either mouse or touch event
  const getPointerPosition = useCallback((): Point | null => {
    const stage = stageRef.current;
    if (!stage) return null;
    
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return null;
    
    return {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY()
    };
  }, []);
  
  // Add this function to check if a point is inside a polygon
  const isPointInPolygon = (point: Point, polygonPoints: number[]): boolean => {
    let inside = false;
    
    // Need at least 3 points (6 coordinates) for a polygon
    if (polygonPoints.length < 6) return false;
    
    const x = point.x;
    const y = point.y;
    
    for (let i = 0, j = polygonPoints.length - 2; i < polygonPoints.length; j = i, i += 2) {
      const xi = polygonPoints[i];
      const yi = polygonPoints[i + 1];
      const xj = polygonPoints[j];
      const yj = polygonPoints[j + 1];
      
      const intersect = ((yi > y) !== (yj > y)) &&
        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        
      if (intersect) inside = !inside;
    }
    
    return inside;
  };
  
  // Add this modified handleFill function
  const handleFill = useCallback((pos: Point) => {
    console.log("Fill tool clicked at:", pos);
    
    // First check if we clicked inside any polygon
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      
      if (shape.type === TOOLS.POLYGON && shape.points && shape.points.length > 0) {
        console.log("Checking polygon:", shape.id);
        
        // Check if the click is inside this polygon
        if (isPointInPolygon(pos, shape.points)) {
          console.log("FOUND POLYGON TO FILL:", shape.id);
          
          // Create a new shapes array with the filled polygon
          const newShapes = [...shapes];
          newShapes[i] = {
            ...newShapes[i],
            fill: newShapes[i].fill === 'transparent' || !newShapes[i].fill 
              ? color 
              : 'transparent'
          };
          
          setShapes(newShapes);
          if (saveToHistory) saveToHistory();
          return; // Stop after filling one polygon
        }
      }
    }
    
    // If we didn't find a polygon, check for shapes with the regular hit test
    // ... rest of original handleFill function
  }, [shapes, setShapes, saveToHistory, color]);
  
  return {
    tool, setTool,
    lines, setLines,
    shapes, setShapes,
    texts, setTexts,
    isDrawing, setIsDrawing,
    color, setColor,
    brushSize, setBrushSize,
    eraserSize, setEraserSize,
    scale, setScale,
    position, setPosition,
    darkMode, setDarkMode,
    stageSize, setStageSize,
    textInputVisible, setTextInputVisible,
    textInputPosition, setTextInputPosition,
    currentText, setCurrentText,
    editingTextId, setEditingTextId,
    fontSize, setFontSize,
    alignment, setAlignment,
    fontStyle, setFontStyle,
    selectedText, setSelectedText,
    selectedTextId, setSelectedTextId,
    stageRef,
    textInputRef,
    pointsBuffer, setPointsBuffer,
    speedBuffer,
    touchStartPosition, setTouchStartPosition,
    isPanning, setIsPanning,
    getPointerPosition,
  };
} 