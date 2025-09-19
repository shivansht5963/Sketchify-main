import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  useTheme,
  Button,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import FunctionsIcon from '@mui/icons-material/Functions';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SearchIcon from '@mui/icons-material/Search';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const tools = [
  {
    id: 1,
    title: "Code Generator",
    description: "Transform sketches into production-ready code",
    icon: <CodeIcon fontSize="large" />,
    color: "#4ECDC4",
    link: "/canvas-to-code",
    bgImage: "/canvas-to-code.png"
  },
  {
    id: 2,
    title: "Math Solver",
    description: "Solve equations by simply drawing them",
    icon: <FunctionsIcon fontSize="large" />,
    color: "#FF6B6B",
    link: "/canvas-math-solver",
    bgImage: "/math-solver.png"
  },
  {
    id: 3,
    title: "AI Assistant",
    description: "Get intelligent analysis of your sketches",
    icon: <SmartToyIcon fontSize="large" />,
    color: "#4ECDC4",
    link: "/canvas-ai-assistant",
    bgImage: "/Heroimage.png"
  },
  {
    id: 4,
    title: "Image Search",
    description: "Find similar images by sketching",
    icon: <SearchIcon fontSize="large" />,
    color: "#FF6B6B",
    link: "/canvas-image-search",
    bgImage: "/canvas-preview.png"
  },
  {
    id: 5,
    title: "Image Generator",
    description: "Turn rough sketches into polished visuals",
    icon: <AutoFixHighIcon fontSize="large" />,
    color: "#4ECDC4",
    link: "/canvas-to-image",
    bgImage: "/canvas-to-image.png"
  }
];

const Dashboard: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: theme.palette.mode === 'dark' 
          ? 'rgba(0, 0, 0, 0.9)' 
          : 'rgba(255, 255, 255, 0.9)',
        pt: 4,
        pb: 8,
      }}
    >
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(45deg, #4ECDC4, #FF6B6B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Welcome to Sketchify
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 4 }}
            >
              Choose a tool to get started with your creative journey
            </Typography>
          </motion.div>
        </Box>

        {/* Tools Grid */}
        <Grid container spacing={3}>
          {tools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={4} key={tool.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Paper
                  component={Link}
                  to={tool.link}
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.background.paper, 0.8)
                      : alpha(theme.palette.background.paper, 0.8),
                    backdropFilter: 'blur(10px)',
                    borderRadius: 4,
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      '& .tool-bg': {
                        opacity: 0.2,
                      }
                    },
                  }}
                >
                  {/* Background Image */}
                  <Box
                    className="tool-bg"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${tool.bgImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      opacity: 0.1,
                      transition: 'opacity 0.3s ease-in-out',
                      zIndex: 0,
                    }}
                  />

                  {/* Content */}
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: 2,
                        mb: 2,
                        color: tool.color,
                        bgcolor: alpha(tool.color, 0.1),
                      }}
                    >
                      {tool.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h2"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {tool.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.text.secondary,
                        mb: 2,
                      }}
                    >
                      {tool.description}
                    </Typography>
                    <Box
                      sx={{
                        mt: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        color: tool.color,
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="button"
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.875rem',
                        }}
                      >
                        Try Now
                      </Typography>
                      <ArrowForwardIcon sx={{ fontSize: '1rem' }} />
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;