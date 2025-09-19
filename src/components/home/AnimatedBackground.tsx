import React from 'react';
import { Box, useTheme } from '@mui/material';

const AnimatedBackground: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
      }}
    >
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: ['100px', '150px', '200px'][i % 3],
            height: ['100px', '150px', '200px'][i % 3],
            borderRadius: '50%',
            background: i % 2 === 0 
              ? 'linear-gradient(45deg, rgba(78, 205, 196, 0.2), rgba(78, 205, 196, 0.05))' 
              : 'linear-gradient(45deg, rgba(255, 107, 107, 0.2), rgba(255, 107, 107, 0.05))',
            filter: 'blur(20px)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: 'translate(-50%, -50%)',
            animation: `float${i} ${15 + i * 2}s infinite ease-in-out`,
            opacity: theme.palette.mode === 'dark' ? 0.4 : 0.7,
            '@keyframes float0': {
              '0%, 100%': { transform: 'translate(-60%, -60%) scale(1)' },
              '50%': { transform: 'translate(-55%, -65%) scale(1.1)' }
            },
            '@keyframes float1': {
              '0%, 100%': { transform: 'translate(-40%, -30%) scale(1)' },
              '50%': { transform: 'translate(-45%, -25%) scale(1.05)' }
            },
            '@keyframes float2': {
              '0%, 100%': { transform: 'translate(-70%, -40%) scale(1)' },
              '50%': { transform: 'translate(-75%, -45%) scale(1.15)' }
            },
            '@keyframes float3': {
              '0%, 100%': { transform: 'translate(-30%, -60%) scale(1)' },
              '50%': { transform: 'translate(-25%, -65%) scale(1.2)' }
            },
            '@keyframes float4': {
              '0%, 100%': { transform: 'translate(-20%, -20%) scale(1)' },
              '50%': { transform: 'translate(-15%, -25%) scale(1.1)' }
            },
            '@keyframes float5': {
              '0%, 100%': { transform: 'translate(-80%, -80%) scale(1)' },
              '50%': { transform: 'translate(-85%, -85%) scale(1.05)' }
            },
          }}
        />
      ))}
    </Box>
  );
};

export default AnimatedBackground; 