import React from 'react';
import { Box, Container, Grid, Typography, Button, Paper, useTheme, Chip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CodeIcon from '@mui/icons-material/Code';
import FunctionsIcon from '@mui/icons-material/Functions';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SearchIcon from '@mui/icons-material/Search';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';

const ToolsShowcase: React.FC = () => {
  const theme = useTheme();
  
  // Tools data with expanded descriptions and instructions
  const tools = [
    {
      id: 1,
      title: "Code Generator",
      shortDescription: "Transform sketches into production-ready code",
      description: "Our advanced AI analyzes your UI sketches and generates clean, maintainable code in multiple frameworks. Perfect for quickly prototyping interfaces or turning whiteboard designs into working components.",
      instructions: [
        "Draw your UI layout on the canvas",
        "Specify your preferred framework (React, HTML/CSS, Vue, etc.)",
        "Add annotations for specific behavior if needed",
        "Click 'Generate Code' to receive your implementation"
      ],
      tips: "For best results, draw clear boundaries between elements and label key components",
      icon: <CodeIcon fontSize="large" />,
      color: "#4ECDC4",
      link: "/canvas-to-code"
    },
    {
      id: 2,
      title: "Math Solver",
      shortDescription: "Solve equations by simply drawing them",
      description: "Struggling with a complex equation? Just sketch it on our canvas and let our AI do the heavy lifting. Get step-by-step solutions for algebra, calculus, geometry, and more—with detailed explanations.",
      instructions: [
        "Draw your mathematical equation or problem",
        "Select the type of math (algebra, calculus, etc.)",
        "Choose between step-by-step or concise solutions",
        "Click 'Solve' to see the complete solution process"
      ],
      tips: "For complex formulas, use the 'Clarity Boost' feature to enhance handwriting recognition",
      icon: <FunctionsIcon fontSize="large" />,
      color: "#FF6B6B",
      link: "/canvas-math-solver"
    },
    {
      id: 3,
      title: "AI Assistant",
      shortDescription: "Get intelligent analysis of your sketches",
      description: "Whether you're brainstorming ideas or refining concepts, our AI assistant provides helpful insights about your sketches. Receive suggestions, identify patterns, and explore new creative directions.",
      instructions: [
        "Sketch your concept or design idea",
        "Specify what kind of feedback you're looking for",
        "Add context about your project goals if needed",
        "Click 'Analyze' to receive AI-powered insights"
      ],
      tips: "The more context you provide about your project goals, the more targeted the AI's suggestions will be",
      icon: <SmartToyIcon fontSize="large" />,
      color: "#4ECDC4",
      link: "/canvas-ai-assistant"
    },
    {
      id: 4,
      title: "Image Search",
      shortDescription: "Find similar images by sketching what you seek",
      description: "Can't find the right reference image? Draw what you're looking for and our AI will find visually similar images from millions of options. Perfect for creative inspiration, mood boards, or finding that perfect reference.",
      instructions: [
        "Sketch what you're looking for (object, scene, style)",
        "Adjust search parameters (color, composition, style)",
        "Add text descriptions to refine your search",
        "Click 'Search' to see visually similar images"
      ],
      tips: "Combining sketch and text descriptions yields the most accurate search results",
      icon: <SearchIcon fontSize="large" />,
      color: "#FF6B6B",
      link: "/canvas-image-search"
    },
    {
      id: 5,
      title: "Image Generator",
      shortDescription: "Turn rough sketches into polished visuals",
      description: "Take your rough sketches to the next level with our AI Image generation tool. Convert your drawings into detailed, styled images , perfect for concept art, illustrations, or quick visual prototypes.",
      instructions: [
        "Create your sketch with basic lines and shapes",
        "Choose a visual style (realistic, cartoon, painting, etc.)",
        "Set additional parameters like color scheme and detail level",
        "Click 'Generate' to transform your sketch"
      ],
      tips: "Use the 'Style Reference' feature to upload an example of your desired aesthetic",
      icon: <AutoFixHighIcon fontSize="large" />,
      color: "#4ECDC4",
      link: "/canvas-to-image"
    }
  ];

  return (
    <Box
      component="section"
      id="tools"
      sx={{
        position: 'relative',
        py: { xs: 10, md: 16 },
        scrollMarginTop: '80px',
      }}
    >
      <Container maxWidth="xl">
        {/* Section heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Typography
              variant="overline"
              component="h2"
              sx={{
                fontSize: { xs: '0.9rem', md: '1rem' },
                fontWeight: 600,
                letterSpacing: 1.2,
                mb: 2,
                color: theme.palette.mode === 'dark' ? '#4ECDC4' : '#4ECDC4',
                textTransform: 'uppercase',
              }}
            >
              Powerful Capabilities
            </Typography>
            
            <Typography
              variant="h2"
              component="h3"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 800,
                mb: 2,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #4ECDC4, #FF6B6B)'
                  : 'linear-gradient(90deg, #4ECDC4, #FF6B6B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
              }}
            >
              AI-Powered Tools
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', md: '1.1rem' },
                maxWidth: '800px',
                mx: 'auto',
                color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                lineHeight: 1.6,
              }}
            >
              Sketchify provides a suite of powerful AI tools to transform your drawings into actionable results.
            </Typography>
          </motion.div>
        </Box>

        {/* Tools list */}
        <Box sx={{ mt: 8 }}>
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Paper
                elevation={0}
                sx={{
                  mb: 6,
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark' 
                    ? 'rgba(30, 41, 59, 0.4)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(0, 0, 0, 0.05)',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 20px 30px -10px rgba(0, 0, 0, 0.3)'
                    : '0 20px 30px -10px rgba(0, 0, 0, 0.1)',
                  transition: 'transform 0.3s ease',
                  overflow: 'hidden',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <Grid container spacing={4}>
                  {/* Tool content - responsive layout */}
                  <Grid item xs={12} md={8}>
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: '100%',
                      position: 'relative',
                      zIndex: 1,
                    }}>
                      {/* Tool header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 56,
                            height: 56,
                            borderRadius: '12px',
                            background: `${tool.color}15`,
                            color: tool.color,
                            mr: 2,
                          }}
                        >
                          {tool.icon}
                        </Box>
                        
                        <Box>
                          <Typography
                            variant="h4"
                            component="h3"
                            sx={{
                              fontSize: { xs: '1.5rem', md: '1.75rem' },
                              fontWeight: 700,
                              color: tool.color,
                              mb: 0.5,
                            }}
                          >
                            {tool.title}
                          </Typography>
                          
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontSize: { xs: '1rem', md: '1.1rem' },
                              color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            }}
                          >
                            {tool.shortDescription}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Tool description */}
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: '1rem',
                          color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                          lineHeight: 1.6,
                          mb: 3,
                        }}
                      >
                        {tool.description}
                      </Typography>
                      
                      {/* How to use section */}
                      <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <TipsAndUpdatesOutlinedIcon 
                            sx={{ color: tool.color, mr: 1, fontSize: '1.2rem' }} 
                          />
                          <Typography
                            variant="h6"
                            component="h4"
                            sx={{
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: theme.palette.mode === 'dark' ? 'white' : 'rgba(0,0,0,0.8)',
                            }}
                          >
                            How to Use
                          </Typography>
                        </Box>
                        
                        <Box component="ol" sx={{ 
                          pl: 3, 
                          mb: 0,
                          '& li': {
                            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            mb: 0.75,
                            pl: 0.5,
                          }
                        }}>
                          {tool.instructions.map((instruction, i) => (
                            <li key={i}>{instruction}</li>
                          ))}
                        </Box>
                      </Box>
                      
                      {/* Pro tip */}
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          background: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                          p: 2,
                          borderRadius: 2,
                          mb: 3,
                        }}
                      >
                        <LightbulbOutlinedIcon 
                          sx={{ 
                            color: theme.palette.mode === 'dark' ? '#FFD700' : '#F59E0B',
                            mr: 1.5,
                            mt: 0.25,
                            flexShrink: 0,
                          }} 
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            fontStyle: 'italic',
                          }}
                        >
                          <strong>Pro Tip:</strong> {tool.tips}
                        </Typography>
                      </Box>
                      
                      {/* Action button */}
                      <Box sx={{ mt: 'auto' }}>
                        <Button
                          component={Link}
                          to={tool.link}
                          variant="outlined"
                          endIcon={<ArrowForwardIcon />}
                          sx={{
                            mt: 2,
                            py: 1.2,
                            px: 3,
                            borderRadius: 2,
                            borderColor: tool.color,
                            color: tool.color,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            '&:hover': {
                              borderColor: tool.color,
                              background: `${tool.color}10`,
                            },
                          }}
                        >
                          Try this tool
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Tool visualization/example */}
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        height: '100%',
                        minHeight: { xs: '200px', md: '300px' },
                        borderRadius: 3,
                        background: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(240, 240, 240, 0.5)',
                        border: theme.palette.mode === 'dark' 
                          ? '1px solid rgba(255, 255, 255, 0.1)' 
                          : '1px solid rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Tool example placeholder - replace with actual images */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ position: 'relative', zIndex: 1 }}
                      >
                        {tool.title} Example
                      </Typography>
                      
                      {/* Decorative background */}
                      <Box
                        sx={{
                          position: 'absolute',
                          inset: 0,
                          opacity: 0.15,
                          backgroundImage: `radial-gradient(circle at 50% 50%, ${tool.color} 0%, transparent 60%)`,
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ToolsShowcase; 