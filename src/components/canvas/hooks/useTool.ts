import { useCallback } from 'react';

interface Shape {
  id: string | number;
  fill?: string;
  // Add other shape properties as needed
}

interface UseToolProps {
  shapes: Shape[];
  setShapes: React.Dispatch<React.SetStateAction<Shape[]>>;
  currentColor: string;
}

export const useTool = ({ shapes, setShapes, currentColor }: UseToolProps) => {
  const fillShape = useCallback((id: string | number) => {
    // Find the shape
    const shapeIndex = shapes.findIndex(shape => shape.id === id);
    
    if (shapeIndex === -1) return;
    
    // Create a copy of the shapes array
    const newShapes = [...shapes];
    
    // Get the current shape
    const shape = newShapes[shapeIndex];
    
    // Toggle the fill
    if (shape.fill === 'transparent' || !shape.fill) {
      shape.fill = currentColor;
    } else {
      shape.fill = 'transparent';
    }
    
    // Update the shapes
    setShapes(newShapes);
  }, [shapes, setShapes, currentColor]);

  return { fillShape };
}; 