import React, { useState } from 'react';
import {
  Box,
  Divider,
  Tooltip,
  IconButton,
  Slider,
  Typography,
  Switch,
  Popover,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { SketchPicker } from 'react-color';
import { motion } from 'framer-motion';

// Icons
import CreateIcon from '@mui/icons-material/Create';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ChangeHistoryIcon from '@mui/icons-material/ChangeHistory';
import PanToolIcon from '@mui/icons-material/PanTool';
import TimelineIcon from '@mui/icons-material/Timeline';
import BackspaceIcon from '@mui/icons-material/Backspace';
import SaveIcon from '@mui/icons-material/Save';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';

import { TOOLS } from './types/canvas.types';

interface CanvasToolbarProps {
  tool: TOOLS;
  setTool: (tool: TOOLS) => void;
  color: string;
  setColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  eraserSize: number;
  setEraserSize: (size: number) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  scale: number;
  setScale: (scale: number) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleClearCanvas: () => void;
  handleExportCanvas: () => void;
  historyStep: number;
  historyLength: number;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    margin: '0 2px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateY(-1px)',
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const toolbarStyles = {
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: (theme: any) => theme.palette.mode === 'dark' ? '#333' : '#f5f5f5',
    borderBottom: (theme: any) => `1px solid ${theme.palette.divider}`,
    gap: 2,
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
  },
  toolGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    padding: '0 8px',
  },
  divider: {
    height: 32,
    margin: '0 12px',
  }
};

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({
  tool,
  setTool,
  color,
  setColor,
  brushSize,
  setBrushSize,
  eraserSize,
  setEraserSize,
  darkMode,
  setDarkMode,
  scale,
  setScale,
  handleUndo,
  handleRedo,
  handleClearCanvas,
  handleExportCanvas,
  historyStep,
  historyLength,
}) => {
  const [colorPickerAnchor, setColorPickerAnchor] = useState<HTMLElement | null>(null);
  
  // Predefined colors
  const colors = [
    '#000000', // Black
    '#FF0000', // Red
    '#0000FF', // Blue
    '#008000', // Green
    '#FFA500', // Orange
  ];

  // Helper to determine if a color is light (for contrasting text)
  const isLightColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128;
  };

  const handleColorPickerClick = (event: React.MouseEvent<HTMLElement>) => {
    setColorPickerAnchor(event.currentTarget);
  };

  const handleColorPickerClose = () => {
    setColorPickerAnchor(null);
  };

  return (
    <Box sx={toolbarStyles.toolbar}>
      <motion.div layout>
        <StyledToggleButtonGroup
          value={tool}
          exclusive
          onChange={(e, newTool) => newTool && setTool(newTool)}
          aria-label="drawing tools"
        >
          <ToggleButton value={TOOLS.SELECT}>
            <Tooltip title="Select Tool (V)" arrow placement="bottom">
              <PanToolIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={TOOLS.PEN}>
            <Tooltip title="Pen Tool (P)" arrow placement="bottom">
              <CreateIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={TOOLS.ERASER}>
            <Tooltip title="Eraser Tool (E)" arrow placement="bottom">
              <BackspaceIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={TOOLS.CIRCLE}>
            <Tooltip title="Circle Tool (C)" arrow placement="bottom">
              <RadioButtonUncheckedIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={TOOLS.RECTANGLE}>
            <Tooltip title="Rectangle Tool (R)" arrow placement="bottom">
              <CropSquareIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={TOOLS.TRIANGLE}>
            <Tooltip title="Triangle Tool (T)" arrow placement="bottom">
              <ChangeHistoryIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={TOOLS.LINE}>
            <Tooltip title="Line Tool (L)" arrow placement="bottom">
              <TimelineIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={TOOLS.TEXT}>
            <Tooltip title="Text Tool (X)" arrow placement="bottom">
              <TextFieldsIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value={TOOLS.FILL}>
            <Tooltip title="Fill Tool">
              <FormatColorFillIcon />
            </Tooltip>
          </ToggleButton>
        </StyledToggleButtonGroup>
      </motion.div>

      <Divider orientation="vertical" sx={toolbarStyles.divider} />

      <motion.div layout style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
          {colors.map((c) => (
            <Tooltip key={c} title={`Quick Color`} arrow placement="bottom">
              <IconButton
                onClick={() => setColor(c)}
                sx={{
                  width: 28,
                  height: 28,
                  backgroundColor: c,
                  border: color === c ? '2px solid #1976d2' : '1px solid #ccc',
                  padding: 0,
                  minWidth: 0,
                  '&:hover': {
                    backgroundColor: c,
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            </Tooltip>
          ))}
        </Box>

        <Divider orientation="vertical" flexItem sx={{ height: 24 }} />

        <Tooltip title="Advanced Color Picker (Alt+C)" arrow placement="bottom">
          <IconButton 
            onClick={handleColorPickerClick}
            sx={{
              backgroundColor: color,
              width: 32,
              height: 32,
              border: '2px solid white',
              boxShadow: 1,
              '&:hover': {
                backgroundColor: color,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ColorLensIcon sx={{ color: isLightColor(color) ? '#000' : '#fff' }} />
          </IconButton>
        </Tooltip>
        
        <Popover
          open={Boolean(colorPickerAnchor)}
          anchorEl={colorPickerAnchor}
          onClose={handleColorPickerClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ p: 2 }}>
            <SketchPicker
              color={color}
              onChange={(newColor) => {
                setColor(newColor.hex);
              }}
              disableAlpha
            />
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {colors.map((c) => (
                <IconButton
                  key={c}
                  onClick={() => {
                    setColor(c);
                    handleColorPickerClose();
                  }}
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: c,
                    border: color === c ? '2px solid #000' : '1px solid #ccc',
                    '&:hover': {
                      backgroundColor: c,
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Popover>
        
        <Box sx={{ width: 100 }}>
          <Slider
            value={tool === TOOLS.ERASER ? eraserSize : brushSize}
            onChange={(e, newValue) => {
              tool === TOOLS.ERASER 
                ? setEraserSize(newValue as number) 
                : setBrushSize(newValue as number)
            }}
            min={1}
            max={50}
            sx={{
              '& .MuiSlider-thumb': {
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.2)',
                },
              },
            }}
          />
        </Box>
      </motion.div>

      <motion.div layout style={{ display: 'flex', gap: '4px' }}>
        <Tooltip title="Undo (Ctrl+Z)" arrow placement="bottom">
          <span>
            <IconButton 
              onClick={handleUndo}
              disabled={historyStep === 0}
              sx={{
                transition: 'all 0.2s ease',
                '&:not(:disabled):hover': {
                  transform: 'translateX(-2px)',
                },
              }}
            >
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Redo (Ctrl+Shift+Z)" arrow placement="bottom">
          <span>
            <IconButton 
              onClick={handleRedo}
              disabled={historyStep === historyLength - 1}
              size="small"
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </motion.div>

      <Tooltip title="Clear Canvas (Alt+Delete)" arrow placement="bottom">
        <IconButton 
          onClick={handleClearCanvas}
          size="small"
          sx={{ 
            color: 'error.main',
            '&:hover': { 
              backgroundColor: 'error.light',
              color: 'error.dark'
            }
          }}
        >
          <DeleteSweepIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Export Canvas" arrow placement="bottom">
        <IconButton 
          onClick={handleExportCanvas}
          size="small"
          sx={{ 
            color: 'primary.main',
            '&:hover': { 
              backgroundColor: 'primary.light',
              color: 'primary.dark'
            }
          }}
        >
          <SaveIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        <Tooltip title="Zoom In (Ctrl++)" arrow placement="bottom">
          <IconButton onClick={() => setScale(scale * 1.2)} size="small">
            <ZoomInIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom Out (Ctrl+-)" arrow placement="bottom">
          <IconButton onClick={() => setScale(scale / 1.2)} size="small">
            <ZoomOutIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Divider orientation="vertical" flexItem />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2">Dark Mode</Typography>
        <Switch
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
          color="default"
        />
      </Box>
    </Box>
  );
};

export default CanvasToolbar; 