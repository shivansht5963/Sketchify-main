import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  CircularProgress, 
  Typography, 
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  useTheme,
  InputBase,
  Chip,
  Grow
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CalculateIcon from '@mui/icons-material/Calculate';
import BackspaceIcon from '@mui/icons-material/Backspace';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Canvas from './Canvas';
import { canvasToImage, analyzeMathProblem } from '../services/mathSolverService';
import { motion, AnimatePresence } from 'framer-motion';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SchoolIcon from '@mui/icons-material/School';
import { keyframes } from '@emotion/react';

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(78, 205, 196, 0.2); }
  50% { box-shadow: 0 0 20px rgba(78, 205, 196, 0.4); }
  100% { box-shadow: 0 0 5px rgba(78, 205, 196, 0.2); }
`;

const CanvasMathSolver: React.FC = () => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [isSolving, setIsSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
  const canvasRef = useRef<any>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  // Scroll to results when solution is available
  useEffect(() => {
    if (solution && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [solution]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSolveMath = async () => {
    if (!canvasRef.current) {
      showSnackbar('Canvas is not available', 'error');
      return;
    }
    
    setIsSolving(true);
    setLoadingProgress(0);
    setSolution(null);
    
    // Define progressInterval variable to track the interval
    let progressInterval: NodeJS.Timeout | undefined = undefined;
    
    // Start progress animation
    progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
    
    // Get reference to the canvas
    const stageRef = canvasRef.current?.stageRef;
    
    // Convert canvas to image
    const imageData = await canvasToImage(stageRef);
    
    if (!imageData) {
      showSnackbar('Could not capture the canvas. Please try again.', 'error');
      setIsSolving(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
      return;
    }
    
    // Send to Gemini for math solving
    const mathResponse = await analyzeMathProblem(imageData, input);
    
    // Parse the response for solution and steps
    const parsedResponse = parseMathResponse(mathResponse);
    
    // Set the solution and steps
    setLoadingProgress(100);
    setTimeout(() => {
      setSolution(parsedResponse.solution);
      setSteps(parsedResponse.steps);
      showSnackbar('Solution generated successfully!', 'success');
      setIsSolving(false);
      setLoadingProgress(0);
      
      // Clear input
      setInput('');
    }, 500);
    
  };

  const parseMathResponse = (response: string) => {
    // Simple parsing - this could be enhanced for better formatting
    const lines = response.split('\n');
    let solution = '';
    const steps: string[] = [];
    
    // Check if the response has a clear "Solution:" marker
    const solutionIndex = lines.findIndex(line => 
      line.toLowerCase().includes('solution:') || 
      line.toLowerCase().includes('answer:')
    );
    
    if (solutionIndex !== -1) {
      solution = lines[solutionIndex];
      // Collect all steps before the solution
      for (let i = 0; i < solutionIndex; i++) {
        if (lines[i].trim()) {
          steps.push(lines[i]);
        }
      }
      // Add any remaining explanation after the solution
      for (let i = solutionIndex + 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          steps.push(lines[i]);
        }
      }
    } else {
      // If no clear solution marker, take the last non-empty line as solution
      const nonEmptyLines = lines.filter(line => line.trim());
      if (nonEmptyLines.length > 0) {
        solution = nonEmptyLines[nonEmptyLines.length - 1];
        // All other lines as steps
        for (let i = 0; i < nonEmptyLines.length - 1; i++) {
          steps.push(nonEmptyLines[i]);
        }
      } else {
        solution = response; // Fallback to the entire response
      }
    }
    
    return { solution, steps };
  };

  const clearCanvas = () => {
    if (canvasRef.current && canvasRef.current.clearCanvas) {
      canvasRef.current.clearCanvas();
    }
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflow: 'hidden',
      // Enhanced gradient background
      '&::before': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: theme.palette.mode === 'dark'
          ? `
            radial-gradient(circle at 0% 0%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(255, 107, 107, 0.1) 0%, transparent 50%)
          `
          : `
            radial-gradient(circle at 0% 0%, rgba(78, 205, 196, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 0%, rgba(255, 107, 107, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(78, 205, 196, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)
          `,
        zIndex: -1,
      },
      // Math pattern layer
      '&::after': {
        content: '""',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: theme.palette.mode === 'dark' ? 0.07 : 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M40 50l-8-8-8 8v60l8 8 8-8V50z' stroke='%234ECDC4' stroke-width='1.5'/%3E%3Cpath d='M24 38h32v4H24z' fill='%234ECDC4'/%3E%3Cpath d='M32 38l-4-10-4 10' stroke='%234ECDC4' stroke-width='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundAttachment: 'fixed',
        backgroundSize: '180px 180px',
        zIndex: -2,
      },
      pb: 10, // Add padding at bottom for fixed input box
    }}>
      {/* Background texture */}
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: theme.palette.mode === 'dark' ? 0.03 : 0.02,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        zIndex: -1,
      }} />

      {/* Enhanced Header */}
      <Box sx={{ 
        width: '100%', 
        py: 3,
        px: 4,
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        bgcolor: theme.palette.mode === 'dark' 
          ? 'rgba(35, 35, 35, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' 
            ? 'rgba(35, 35, 35, 0.9)'
            : 'rgba(255, 255, 255, 0.9)',
        }
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            maxWidth: '1600px',
            width: '100%',
          }}>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
            >
              <CalculateIcon sx={{ 
                fontSize: 32, 
                color: theme.palette.primary.main,
                filter: 'drop-shadow(0 0 8px rgba(78, 205, 196, 0.3))',
                animation: `${glowAnimation} 2s infinite`
              }} />
            </motion.div>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.5px',
                  mb: 0.5,
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -2,
                    left: 0,
                    width: '100%',
                    height: 2,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    transform: 'scaleX(0)',
                    transformOrigin: 'right',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover::after': {
                    transform: 'scaleX(1)',
                    transformOrigin: 'left',
                  }
                }}
              >
                Math Problem Solver
              </Typography>
              <Typography 
                variant="subtitle2" 
                color="text.secondary"
                sx={{ 
                  opacity: 0.8,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 1
                  }
                }}
              >
                Draw or write a math problem to get instant solutions
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Box>

      {/* Main Content Container */}
      <Box sx={{ 
        width: '98%',
        maxWidth: '1600px',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        mt: 3,
        mb: 12, // Add bottom margin to prevent content from being hidden behind fixed input
      }}>
        {/* Instructions */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 2.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(35, 35, 35, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <InfoOutlinedIcon sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 500 }}>
              Draw or write your math problem on the canvas below, then click "Solve" for step-by-step solutions.
            </Typography>
          </Box>
        </Paper>

        {/* Canvas Area with Enhanced Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Paper 
            elevation={0}
            sx={{ 
              width: '100%',
              height: '850px',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: 3,
              border: '2px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              bgcolor: '#ffffff',
              overflow: 'hidden',
              position: 'relative',
              backdropFilter: 'blur(10px)',
              boxShadow: theme.palette.mode === 'dark' 
                ? '0 0 30px rgba(0,0,0,0.3)'
                : '0 10px 30px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.palette.mode === 'dark' 
                  ? '0 0 40px rgba(0,0,0,0.4)'
                  : '0 15px 40px rgba(0,0,0,0.15)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            {/* Canvas Tools Header with Shimmer Effect */}
            <Box sx={{
              p: 2,
              borderBottom: '1px solid',
              borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 45, 0.95)' : 'rgba(248, 249, 250, 0.95)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1.5,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '200%',
                height: '100%',
                background: `linear-gradient(90deg, 
                  transparent, 
                  ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)'}, 
                  transparent)`,
                animation: `${shimmerAnimation} 3s infinite linear`,
              }
            }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1.5,
                  background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  <CalculateIcon sx={{ 
                    fontSize: 20, 
                    color: theme.palette.primary.main,
                    filter: 'drop-shadow(0 0 4px rgba(78, 205, 196, 0.3))'
                  }} />
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                    }}
                  >
                    Math Canvas
                  </Typography>
                </Box>
              </motion.div>
            </Box>

            {/* Canvas Wrapper */}
            <Box sx={{ 
              flex: 1,
              width: '100%',
              bgcolor: '#ffffff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}>
              <Canvas ref={canvasRef} />
            </Box>
          </Paper>
        </motion.div>

        {/* Solution Results Section */}
        <Box ref={resultsSectionRef} sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 8 }}>
          <AnimatePresence mode="wait">
            {solution && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: '100%', maxWidth: '1600px' }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    bgcolor: theme.palette.background.paper,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }}
                >
                  {/* Solution Header */}
                  <Box sx={{ 
                    p: 3, 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 45, 0.8)' : 'rgba(248, 249, 250, 0.8)',
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <SchoolIcon sx={{ 
                        color: theme.palette.primary.main,
                        fontSize: 28,
                        animation: `${pulseAnimation} 2s infinite ease-in-out`
                      }} />
                      <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          Solution
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Step-by-step explanation of the problem
                        </Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label="Math Solution" 
                      color="primary" 
                      size="medium"
                      sx={{ borderRadius: 2 }}
                    />
                  </Box>

                  {/* Solution Content */}
                  <Box sx={{ p: 4 }}>
                    {/* Final Solution */}
                    <Box sx={{ 
                      mb: 4, 
                      p: 3, 
                      borderRadius: 2,
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(78, 205, 196, 0.1)' : 'rgba(78, 205, 196, 0.05)',
                      border: '1px solid',
                      borderColor: theme.palette.mode === 'dark' ? 'rgba(78, 205, 196, 0.2)' : 'rgba(78, 205, 196, 0.2)',
                    }}>
                      <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                        Final Answer:
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          wordBreak: 'break-word',
                        }}
                      >
                        {solution.replace(/^(Solution:|Answer:)/i, '').trim()}
                      </Typography>
                    </Box>

                    {/* Solution Steps */}
                    {steps.length > 0 && (
                      <Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1, 
                          mb: 2,
                          pb: 1,
                          borderBottom: '1px solid',
                          borderColor: theme.palette.divider
                        }}>
                          <AutoAwesomeIcon color="primary" />
                          <Typography variant="h6">
                            Step-by-Step Solution
                          </Typography>
                        </Box>

                        <Box sx={{ 
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2
                        }}>
                          {steps.map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                                  display: 'flex',
                                  gap: 2,
                                }}
                              >
                                <Box sx={{ 
                                  minWidth: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  bgcolor: theme.palette.primary.main,
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                }}>
                                  {index + 1}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Typography variant="body1" sx={{ 
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    fontFamily: 'monospace',
                                    fontSize: '1rem'
                                  }}>
                                    {step}
                                  </Typography>
                                </Box>
                              </Paper>
                            </motion.div>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Loading Indicator */}
      {isSolving && (
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}>
          <Box sx={{
            position: 'relative',
            width: 120,
            height: 120,
            animation: `${floatAnimation} 2s ease-in-out infinite`,
          }}>
            <CircularProgress
              variant="determinate"
              value={loadingProgress}
              size={120}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
            />
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <CalculateIcon 
                sx={{ 
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  animation: `${pulseAnimation} 2s ease-in-out infinite`,
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 1,
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                }}
              >
                {Math.round(loadingProgress)}%
              </Typography>
            </Box>
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.secondary',
              textAlign: 'center',
              maxWidth: 300,
              animation: `${pulseAnimation} 2s ease-in-out infinite`,
            }}
          >
            Solving your math problem...
          </Typography>
        </Box>
      )}

      {/* Enhanced Fixed Input Box */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper 
          elevation={8}
          sx={{ 
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'auto',
            maxWidth: '800px',
            p: 1,
            borderRadius: 10,
            backdropFilter: 'blur(20px)',
            bgcolor: theme.palette.mode === 'dark' 
              ? 'rgba(35, 35, 35, 0.85)'
              : 'rgba(255, 255, 255, 0.85)',
            border: '1px solid',
            borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            zIndex: 1200,
            boxShadow: theme.palette.mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.4)'
              : '0 8px 32px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateX(-50%) translateY(-2px)',
              boxShadow: theme.palette.mode === 'dark'
                ? '0 12px 40px rgba(0,0,0,0.5)'
                : '0 12px 40px rgba(0,0,0,0.15)',
            }
          }}
        >
          <Box sx={{ 
            display: 'flex',
            gap: 1,
            px: 1,
          }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 5,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  '&:hover': {
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)',
                    borderColor: theme.palette.primary.main,
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <AutoAwesomeIcon 
                    sx={{ 
                      ml: 2, 
                      color: theme.palette.primary.main,
                      opacity: 0.8,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        opacity: 1,
                        transform: 'scale(1.1)',
                      }
                    }} 
                  />
                </motion.div>
                <InputBase
                  placeholder="Add context or specify what to solve (optional)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSolving && handleSolveMath()}
                  disabled={isSolving}
                  sx={{
                    ml: 2,
                    mr: 3,
                    flex: 1,
                    fontSize: '1rem',
                    width: '400px',
                    '& input': {
                      p: 1.5,
                      '&::placeholder': {
                        opacity: 0.7,
                        transition: 'opacity 0.2s ease',
                      },
                      '&:focus::placeholder': {
                        opacity: 0.4,
                      },
                    },
                  }}
                />
              </Paper>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={isSolving}
                onClick={handleSolveMath}
                sx={{
                  px: 3,
                  borderRadius: 5,
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: theme.palette.mode === 'dark' 
                    ? '0 0 20px rgba(0,0,0,0.4)'
                    : '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 0 25px rgba(0,0,0,0.5)'
                      : '0 6px 16px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {isSolving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <motion.div
                    style={{ display: 'flex', alignItems: 'center' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CalculateIcon sx={{ mr: 1 }} />
                    Solve
                  </motion.div>
                )}
              </Button>
            </motion.div>
          </Box>
        </Paper>
      </motion.div>

      {/* Enhanced Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={4000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={Grow}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={snackbarSeverity} 
            variant="filled"
            sx={{ 
              width: '100%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              '& .MuiAlert-icon': {
                animation: `${pulseAnimation} 2s infinite`
              }
            }}
          >
            {snackbarMessage}
          </Alert>
        </motion.div>
      </Snackbar>
    </Box>
  );
};

export default CanvasMathSolver; 