import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  Chip,
  alpha,
  useTheme
} from '@mui/material';
import { motion } from 'framer-motion';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CodeIcon from '@mui/icons-material/Code';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import FunctionsIcon from '@mui/icons-material/Functions';

const futureTools = [
  {
    title: 'Canvas to Image',
    description: 'Transform your sketches into high-quality images using AI',
    icon: <AutoFixHighIcon sx={{ fontSize: 40 }} />,
    image: '/canvas-to-image.png',
    color: '#FF6B6B',
    comingSoon: true
  },
  {
    title: 'Canvas to Code',
    description: 'Convert hand-drawn wireframes into actual code',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    image: '/canvas-to-code.png',
    color: '#4ECDC4',
    comingSoon: true
  },
  {
    title: 'Canvas to Flowchart',
    description: 'Automatically generate flowcharts from your sketches',
    icon: <AccountTreeIcon sx={{ fontSize: 40 }} />,
    image: '/canvas-to-flowchart.png',
    color: '#45B7D1',
    comingSoon: true
  },
  {
    title: 'Math Solver',
    description: 'Solve handwritten mathematical expressions instantly',
    icon: <FunctionsIcon sx={{ fontSize: 40 }} />,
    image: '/math-solver.png',
    color: '#9B59B6',
    comingSoon: true
  }
];

const sectionVariants = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 1
    }
  }
};

const Tools: React.FC = () => {
  const theme = useTheme();

  return (
    <Box 
      id="future-tools" 
      sx={{ 
        pt: '80px',
        minHeight: '100vh',
        scrollMarginTop: '80px',
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          align="center" 
          sx={{ 
            mb: 2,
            fontWeight: 700,
            background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Coming Soon
        </Typography>
        <Typography 
          variant="h5" 
          align="center" 
          color="text.secondary" 
          sx={{ mb: 8 }}
        >
          Exciting new features on the horizon
        </Typography>

        <Grid container spacing={4}>
          {futureTools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    background: alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: alpha(tool.color, 0.2),
                    transition: 'all 0.3s ease',
                    minHeight: '380px',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 12px 25px ${alpha(tool.color, 0.2)}`,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '200px',
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={tool.image}
                      alt={tool.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scale(1.02)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `linear-gradient(to bottom, transparent 0%, ${alpha(tool.color, 0.2)} 100%)`,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        width: 50,
                        height: 50,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: alpha(theme.palette.background.paper, 0.9),
                        backdropFilter: 'blur(8px)',
                        color: tool.color,
                        boxShadow: `0 4px 12px ${alpha(tool.color, 0.3)}`,
                        zIndex: 2,
                      }}
                    >
                      {tool.icon}
                    </Box>
                  </Box>

                  <CardContent 
                    sx={{ 
                      p: 3,
                      flexGrow: 1, 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: 1,
                    }}
                  >
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        mb: 1,
                      }}
                    >
                      {tool.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        flexGrow: 1,
                      }}
                    >
                      {tool.description}
                    </Typography>
                    
                    <Chip
                      label="Coming Soon"
                      sx={{
                        alignSelf: 'flex-start',
                        background: alpha(tool.color, 0.1),
                        color: tool.color,
                        fontWeight: 600,
                        borderRadius: '8px',
                        px: 2,
                      }}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Tools;