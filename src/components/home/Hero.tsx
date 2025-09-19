import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Button, Grid, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import BrushIcon from '@mui/icons-material/Brush';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CreateIcon from '@mui/icons-material/Create';

// Updated handwriting styles with larger font size
const handwritingStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&family=Shadows+Into+Light&family=Gloria+Hallelujah&display=swap');
  
  .handwriting-container {
    overflow: visible;
    width: 100%;
    font-family: 'Gloria Hallelujah', 'Indie Flower', 'Shadows Into Light', cursive;
    font-size: 1.8rem;
    line-height: 1.8;
    color: #FF6B6B;
    padding: 16px;
    min-height: 150px;
    word-break: break-word;
    white-space: pre-wrap;
    letter-spacing: 0.5px;
    font-weight: 500;
  }
`;

const Hero: React.FC = () => {
  const theme = useTheme();
  const penRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = handwritingStyles;
    document.head.appendChild(styleTag);
    
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);
  
  // Array of dynamic descriptions for each tool
  const toolDescriptions = [
    "Convert your UI sketches into  React components or HTML/CSS/JS with AI-powered code generation.",
    "Draw math equations or visual problems on the canvas and get  step-by-step solutions instantly.",
    "Analyze and get AI-powered insights, explanations, and suggestions for your sketches in real-time.",
    "Search for visually similar images by sketching your idea—powered by advanced image search AI.",
    "Turn your rough sketches into AI-generated images that bring your ideas to life based on your drawings."
];

  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  
  // Animation effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isErasing) {
      // Erase text
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, 10);
      } else {
        // Move to next description
        setIsErasing(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % toolDescriptions.length);
        setCharIndex(0);
      }
    } else {
      // Writing text
      const currentText = toolDescriptions[currentIndex];
      
      if (charIndex < currentText.length) {
        timer = setTimeout(() => {
          setDisplayText(prev => prev + currentText.charAt(charIndex));
          setCharIndex(prev => prev + 1);
        }, 50);
      } else {
        // Pause at the end before erasing
        timer = setTimeout(() => {
          setIsErasing(true);
        }, 1000);
      }
    }
    
    return () => clearTimeout(timer);
  }, [displayText, currentIndex, charIndex, isErasing, toolDescriptions]);
  
  // Improved pen position calculation
  useEffect(() => {
    if (!penRef.current || !textContainerRef.current) return;
    
    const penElement = penRef.current;
    const textElement = textContainerRef.current;
    
    // Function to calculate the position of the last character
    const calculatePosition = () => {
      // Create a temporary span with the same styling as the text container
      const tempSpan = document.createElement('span');
      tempSpan.style.fontFamily = textElement.style.fontFamily || "'Gloria Hallelujah', cursive";
      tempSpan.style.fontSize = window.getComputedStyle(textElement).fontSize;
      tempSpan.style.width = (textElement.clientWidth - 16) + 'px'; // Account for padding
      tempSpan.style.position = 'absolute';
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.whiteSpace = 'pre-wrap';
      tempSpan.style.wordBreak = 'break-word';
      tempSpan.style.lineHeight = '1.5';
      tempSpan.innerText = displayText;
      
      document.body.appendChild(tempSpan);
      
      // Get the dimensions
      const rect = tempSpan.getBoundingClientRect();
      
      // We need to get the coordinates of the last character
      const lastCharSpan = document.createElement('span');
      lastCharSpan.innerText = displayText.charAt(displayText.length - 1) || '';
      tempSpan.appendChild(lastCharSpan);
      const lastCharRect = lastCharSpan.getBoundingClientRect();
      
      // Clean up
      document.body.removeChild(tempSpan);
      
      // Get the position relative to the container
      const containerRect = textElement.getBoundingClientRect();
      
      // Return the position of the last character
      return {
        x: lastCharRect.right - containerRect.left,
        y: lastCharRect.top - containerRect.top
      };
    };
    
    // Only calculate if we have text
    if (displayText.length > 0) {
      const pos = calculatePosition();
      
      // Position the pen at the end of text
      penElement.style.left = `${pos.x + 2}px`; // Small offset
      penElement.style.top = `${pos.y - 4}px`; // Position slightly above the text
    } else {
      // Position at the start of the container
      penElement.style.left = '8px';
      penElement.style.top = '8px';
    }
  }, [displayText]);

  return (
    <Box
      sx={{ 
        position: 'relative',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 16 },
        overflow: 'hidden'
      }}
    >
      {/* Background elements */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: Math.random() * 100 + 50,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            style={{
              position: 'absolute',
              width: Math.random() * 300 + 50,
              height: Math.random() * 300 + 50,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${i % 2 === 0 ? '#4ECDC430' : '#FF6B6B30'} 0%, transparent 70%)`,
              filter: 'blur(40px)',
              opacity: 0.6,
            }}
          />
        ))}
      </Box>
      
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 8 }} alignItems="center">
        <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: 600, mx: { xs: 'auto', md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography 
              variant="h1" 
                  component="h1"
              sx={{ 
                fontWeight: 800,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
                    lineHeight: 1.1,
                    mb: 4,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #4ECDC4, #FF6B6B)'
                      : 'linear-gradient(90deg, #4ECDC4, #FF6B6B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent'
              }}
            >
                  Nexa - AI Canvas <br />
                  Built for SYNAPSE
            </Typography>
                
                {/* Text animation container with more height and spacing */}
                <Box 
              sx={{ 
                    height: 'auto',
                    minHeight: '100px',
                    mb: 5,
                    position: 'relative',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(15, 23, 42, 0.3)' 
                      : 'rgba(248, 250, 252, 0.3)',
                    borderRadius: 2,
                    overflow: 'visible',
                    py: 1
                  }}
                >
                  {/* Text container with proper wrapping */}
                  <div 
                    ref={textContainerRef}
                    className="handwriting-container"
                  >
                    {displayText}
                  </div>
                  
                  {/* Stylus pen with improved positioning */}
                  <div 
                    ref={penRef}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      pointerEvents: 'none',
                      display: isErasing ? 'none' : 'block',
                      color: '#FF6B6B',
                      filter: 'drop-shadow(0 0 3px rgba(255, 107, 107, 0.7))',
                      zIndex: 10,
                      transition: 'top 0.1s, left 0.1s'
                    }}
                  >
                    <motion.div
                      animate={{
                        rotate: [-30, -25, -28],
                        scale: [1, 1.03, 1]
                      }}
                      transition={{
                        duration: 0.3,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      style={{
                        display: 'flex',
                        transformOrigin: 'bottom right'
                      }}
                    >
                      <CreateIcon fontSize="medium" />
                    </motion.div>
                  </div>
                </Box>
                
                {/* Buttons with more spacing */}
                <Box sx={{ 
                  display: 'flex', 
                  gap: 3,
                  flexWrap: 'wrap', 
                  justifyContent: { xs: 'center', md: 'flex-start' },
                  mt: 2
                }}>
              <Button
                    component={Link}
                    to="/dashboard"
                variant="contained"
                size="large"
                    startIcon={<BrushIcon />}
                sx={{
                      py: 1.5,
                      px: 3,
                  fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: '0 8px 16px rgba(255, 107, 107, 0.2)',
                      background: 'linear-gradient(90deg, #FF6B6B, #FF9E9E)',
                  '&:hover': {
                        background: 'linear-gradient(90deg, #FF5C5C, #FF8F8F)',
                    transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px rgba(255, 107, 107, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                    Get Started Free
              </Button>
                  
              {/* Second button removed for direct access */}
                </Box>
              </motion.div>
            </Box>
        </Grid>
          
          {/* Image grid */}
        <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
          <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box
              sx={{
                position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <Box
                    component="img"
                    src="/Heroimage.png" 
                    alt="Sketchify Canvas"
                    sx={{
                  width: '100%',
                      height: 'auto',
                      borderRadius: 4,
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                        : '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  
                  {/* Floating UI elements - More responsive positioning */}
                  <Box
                    component={motion.div}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    sx={{
                      position: 'absolute',
                      top: { xs: '5%', sm: '10%' },
                      right: { xs: '-5%', sm: '-10%' },
                      background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      p: { xs: 1.5, sm: 2 },
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(0, 0, 0, 0.05)',
                      width: { xs: 140, sm: 180 },
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: '#4ECDC4', fontWeight: 700 }}>
                      AI Assistant
                    </Typography>
                    <Typography variant="body2">
                      "This appears to be a wireframe for a dashboard interface."
                    </Typography>
                  </Box>
                  
                  <Box
                    component={motion.div}
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    sx={{
                      position: 'absolute',
                      bottom: { xs: '3%', sm: '5%' },
                      left: { xs: '-3%', sm: '-5%' },
                      background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 3,
                      p: { xs: 1.5, sm: 2 },
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 10px 15px -3px rgba(0, 0, 0, 0.4)'
                        : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.1)'
                        : '1px solid rgba(0, 0, 0, 0.05)',
                      width: { xs: 130, sm: 160 },
                      display: { xs: 'none', sm: 'block' }
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ color: '#FF6B6B', fontWeight: 700 }}>
                      Math Solver
                    </Typography>
                    <Typography variant="body2">
                      "Solution: x = 42"
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero; 