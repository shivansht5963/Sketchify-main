import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Slider,
  Select,
  MenuItem,
  Divider,
  FormControl,
  InputLabel,
  Paper,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { TOOLS } from './types/canvas.types';

interface TextToolboxProps {
  color: string;
  setColor: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  alignment: string;
  setAlignment: (alignment: string) => void;
  fontStyle: string;
  setFontStyle: (style: string) => void;
  selectedText: any;
  deleteSelectedText?: () => void;
  tool: TOOLS;
  minimized?: boolean;
  setMinimized?: (minimized: boolean) => void;
}

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  '& .MuiToggleButton-root': {
    padding: '6px',
    border: 'none',
    borderRadius: '4px',
    margin: '0 2px',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  },
}));

const TextToolbox: React.FC<TextToolboxProps> = ({
  color,
  setColor,
  fontSize,
  setFontSize,
  alignment,
  setAlignment,
  fontStyle,
  setFontStyle,
  selectedText,
  deleteSelectedText,
  tool,
  minimized,
  setMinimized,
}) => {
  // Available font families
  const fontFamilies = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Comic Sans MS',
    'Georgia',
    'Verdana',
  ];

  // Define predefined font sizes for quick selection
  const predefinedSizes = [12, 16, 20, 24, 36, 48];

  useEffect(() => {
    if (selectedText) {
      // Update toolbox state to match selected text
      setFontSize(selectedText.fontSize);
      setFontStyle(selectedText.fontFamily);
      setAlignment(selectedText.align);
      setColor(selectedText.fill);
    }
  }, [selectedText]);

  return (
    <Box
      className="text-toolbox-drawer"
      sx={{
        position: 'absolute',
        top: 80,
        right: minimized ? -320 : 0, // Slide in/out from right
        height: 'auto',
        maxHeight: '80vh',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        transition: 'right 0.3s ease-in-out',
      }}
    >
      {/* Tab/handle that's always visible */}
      <Box
        onClick={() => setMinimized && setMinimized(!minimized)}
        sx={{
          cursor: 'pointer',
          backgroundColor: 'primary.main',
          color: 'white',
          borderTopLeftRadius: 8,
          borderBottomLeftRadius: 8,
          padding: '8px 4px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          height: 80,
          mr: -1, // Slightly overlap with drawer
        }}
      >
        <Box sx={{ transform: minimized ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>
          {minimized ? '▶' : '◀'}
        </Box>
        <Typography
          variant="caption"
          sx={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            transform: 'rotate(180deg)',
            mt: 1,
            fontSize: '0.7rem',
          }}
        >
          Text Format
        </Typography>
      </Box>

      {/* Main drawer content */}
      <Paper
        elevation={3}
        sx={{
          width: 320,
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}
      >
        <Box sx={{
          p: 1,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography variant="subtitle2">
            {selectedText ? 'Edit Text' : 'Text Format'}
          </Typography>
          
          {selectedText && deleteSelectedText && (
            <IconButton 
              size="small" 
              onClick={deleteSelectedText}
              sx={{ color: 'white' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box sx={{ p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Font Size: {fontSize}px
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.8, mb: 1, flexWrap: 'wrap' }}>
              {predefinedSizes.map(size => (
                <IconButton
                  key={size}
                  size="small"
                  onClick={() => setFontSize(size)}
                  sx={{
                    minWidth: 32,
                    height: 32,
                    border: fontSize === size ? '2px solid' : '1px solid',
                    borderColor: fontSize === size ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    padding: 0,
                    fontSize: Math.min(size / 2, 16),
                    fontWeight: 'bold',
                  }}
                >
                  {size}
                </IconButton>
              ))}
            </Box>
            <Slider
              value={fontSize}
              onChange={(_, value) => setFontSize(value as number)}
              min={8}
              max={72}
              step={1}
              aria-label="Font Size"
              valueLabelDisplay="auto"
              sx={{ mt: 1 }}
            />
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Text Alignment
            </Typography>
            <StyledToggleButtonGroup
              value={alignment}
              exclusive
              onChange={(_, value) => value && setAlignment(value)}
              aria-label="text alignment"
              size="small"
              sx={{ display: 'flex', width: '100%' }}
            >
              <ToggleButton value="left" aria-label="left aligned" sx={{ flex: 1 }}>
                <FormatAlignLeftIcon />
              </ToggleButton>
              <ToggleButton value="center" aria-label="centered" sx={{ flex: 1 }}>
                <FormatAlignCenterIcon />
              </ToggleButton>
              <ToggleButton value="right" aria-label="right aligned" sx={{ flex: 1 }}>
                <FormatAlignRightIcon />
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="font-family-label">Font Family</InputLabel>
            <Select
              labelId="font-family-label"
              id="font-family-select"
              value={fontStyle}
              label="Font Family"
              onChange={(e) => setFontStyle(e.target.value)}
              size="small"
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {fontFamilies.map((font) => (
                <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
    </Box>
  );
};

export default TextToolbox; 