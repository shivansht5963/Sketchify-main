import React from 'react';
import { Fab, Tooltip, Zoom, useTheme, alpha } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useNavigate } from 'react-router-dom';

const FloatingCTA: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Tooltip 
      title="Try Canvas" 
      placement="left" 
      TransitionComponent={Zoom}
    >
      <Fab
        color="primary"
        aria-label="try canvas"
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 10,
          background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
          boxShadow: `0 8px 16px ${alpha('#FF6B6B', 0.3)}`,
          '&:hover': {
            background: 'linear-gradient(45deg, #FF5555, #45B7D1)',
          },
        }}
        onClick={() => navigate('/canvas')}
      >
        <RocketLaunchIcon />
      </Fab>
    </Tooltip>
  );
};

export default FloatingCTA; 