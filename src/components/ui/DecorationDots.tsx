import React from 'react';
import { Box, useTheme } from '@mui/material';

interface DecorationDotsProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  size?: number;
}

const DecorationDots: React.FC<DecorationDotsProps> = ({ 
  position = 'top-right',
  color = '#4ECDC4',
  size = 80
}) => {
  const theme = useTheme();
  
  const positionStyles = {
    'top-left': { top: 40, left: 40 },
    'top-right': { top: 40, right: 40 },
    'bottom-left': { bottom: 40, left: 40 },
    'bottom-right': { bottom: 40, right: 40 },
  };
  
  return (
    <Box
      sx={{
        position: 'absolute',
        ...positionStyles[position],
        width: size,
        height: size,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: '6px',
        opacity: 0.5,
        zIndex: 0,
      }}
    >
      {[...Array(9)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: color,
            opacity: [0.3, 0.5, 0.7, 0.9][i % 4],
          }}
        />
      ))}
    </Box>
  );
};

export default DecorationDots; 