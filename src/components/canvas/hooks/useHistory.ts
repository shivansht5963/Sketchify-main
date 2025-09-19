import { useState } from 'react';
import { HistoryState, Line, Shape, TextShape } from '../types/canvas.types';

interface UseHistoryProps {
  lines: Line[];
  shapes: Shape[];
  texts: TextShape[];
  setLines: (lines: Line[]) => void;
  setShapes: (shapes: Shape[]) => void;
  setTexts: (texts: TextShape[]) => void;
}

export default function useHistory({
  lines,
  shapes,
  texts,
  setLines,
  setShapes,
  setTexts
}: UseHistoryProps) {
  const [history, setHistory] = useState<HistoryState[]>([{ lines: [], shapes: [], texts: [] }]);
  const [historyStep, setHistoryStep] = useState<number>(0);

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push({
      lines: [...lines],
      shapes: [...shapes],
      texts: [...texts],
    });
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      const prevState = history[newStep];
      setLines([...prevState.lines]);
      setShapes([...prevState.shapes]);
      setTexts([...prevState.texts]);
      setHistoryStep(newStep);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      const nextState = history[newStep];
      setLines([...nextState.lines]);
      setShapes([...nextState.shapes]);
      setTexts([...nextState.texts]);
      setHistoryStep(newStep);
    }
  };

  return {
    history,
    historyStep,
    saveToHistory,
    handleUndo,
    handleRedo
  };
} 