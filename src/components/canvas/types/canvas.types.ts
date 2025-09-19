import { MutableRefObject } from 'react';
import { Stage } from 'konva/lib/Stage';

export enum TOOLS {
  SELECT = 'select',
  PEN = 'pen',
  ERASER = 'eraser',
  CIRCLE = 'circle',
  RECTANGLE = 'rectangle',
  TRIANGLE = 'triangle',
  LINE = 'line',
  TEXT = 'text',
  FILL = 'fill',
  POLYGON = 'polygon',
  POLYLINE = 'polyline',
  POLYGON_HIT = 'polygon_hit'
}

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
}

export interface Shape {
  id: string | number;
  type: TOOLS;
  x: number;
  y: number;
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  stroke?: string;
  points?: number[];
  hitPolygonId?: string | number;
  customProps?: any;
}

export interface TextShape {
  id: number | string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  draggable: boolean;
  align: string;
}

export interface HistoryState {
  lines: Line[];
  shapes: Shape[];
  texts: TextShape[];
}

export interface StageSize {
  width: number;
  height: number;
}

export interface DrawingState {
  tool: TOOLS;
  lines: Line[];
  shapes: Shape[];
  texts: TextShape[];
  color: string;
  brushSize: number;
  eraserSize: number;
  darkMode: boolean;
  scale: number;
  position: Point;
  stageRef: MutableRefObject<Stage | null>;
  textInputRef: MutableRefObject<HTMLTextAreaElement | null>;
  textInputVisible: boolean;
  textInputPosition: Point;
  currentText: string;
  editingTextId: string | number | null;
  fontSize: number;
  alignment: string;
  fontStyle: string;
  selectedText: TextShape | null;
  selectedTextId: string | number | null;
} 