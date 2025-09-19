import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Typography, 
  CircularProgress, 
  Snackbar, 
  Alert,
  Divider,
  Tabs,
  Tab,
  useTheme,
  IconButton,
  Tooltip,
  Chip,
  Grow,
  InputBase
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshIcon from '@mui/icons-material/Refresh';
import Canvas from './Canvas';
import { canvasToImage } from '../services/aiAssistantService';
import { generateSearchQuery } from '../services/aiCanvasImageSearchService';
import { searchImages, ImageResult } from '../services/imageSearchService';
import ImageGallery from '../components/ImageGallery';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Animation keyframes
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const shimmerAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
`;

const glowAnimation = keyframes`
  0% { filter: drop-shadow(0 0 4px rgba(78, 205, 196, 0.2)); }
  50% { filter: drop-shadow(0 0 10px rgba(78, 205, 196, 0.5)); }
  100% { filter: drop-shadow(0 0 4px rgba(78, 205, 196, 0.2)); }
`;

const CanvasImageSearch: React.FC = () => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [images, setImages] = useState<ImageResult[]>([]);
  const canvasRef = useRef<any>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Scroll to results when images are available
  useEffect(() => {
    if (images.length > 0 && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [images]);

  // Fetch images when searchQuery changes
  useEffect(() => {
    if (searchQuery) {
      fetchImages(searchQuery);
    }
  }, [searchQuery]);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const fetchImages = async (query: string) => {
    setIsLoadingImages(true);
    setLoadingProgress(30); // Start with some progress
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          const next = prev + Math.random() * 10;
          return next > 80 ? 80 : next;
        });
      }, 300);
      
      const results = await searchImages(query);
      setImages(results);
      
      clearInterval(progressInterval);
      setLoadingProgress(100);
      
      showSnackbar(`Found ${results.length} images for "${query}"`, 'success');
    } catch (error) {
      console.error("Error fetching images:", error);
      showSnackbar('Error fetching images. Please try again.', 'error');
    } finally {
      setTimeout(() => {
        setIsLoadingImages(false);
        setLoadingProgress(0);
      }, 500);
    }
  };

  const handleSearch = async () => {
    setIsProcessing(true);
    setSearchQuery(null);
    setImages([]);
    
    // Start progress animation
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) {
        progress = 90;
        clearInterval(progressInterval);
      }
      setLoadingProgress(progress);
    }, 300);
    
    try {
      // Get reference to the canvas
      const stageRef = canvasRef.current?.stageRef;
      
      // Convert canvas to image
      const imageData = await canvasToImage(stageRef);
      
      if (!imageData) {
        showSnackbar('Could not capture the canvas. Please try again.', 'error');
        setIsProcessing(false);
        clearInterval(progressInterval);
        setLoadingProgress(0);
        return;
      }
      
      // Generate search query
      const query = await generateSearchQuery(imageData, input);
      
      if (!query || query.includes("Error")) {
        showSnackbar('Could not identify what you drew. Please try a different drawing or add more details.', 'warning');
        setIsProcessing(false);
        clearInterval(progressInterval);
        setLoadingProgress(0);
        return;
      }
      
      setSearchQuery(query);
      showSnackbar(`Searching for images of "${query}"`, 'info');
      
    } catch (error) {
      console.error("Error searching:", error);
      showSnackbar('Error generating search query. Please try again.', 'error');
      setIsProcessing(false);
      clearInterval(progressInterval);
      setLoadingProgress(0);
    } finally {
      clearInterval(progressInterval);
      setIsProcessing(false);
    }
  };

  // Add Google Custom Search script dynamically (as requested)
  useEffect(() => {
    // Only add if it doesn't exist already
    if (!document.querySelector('script[src="https://cse.google.com/cse.js?cx=90ee8e14349114c9b"]')) {
      const script = document.createElement('script');
      script.src = 'https://cse.google.com/cse.js?cx=90ee8e14349114c9b';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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
      // Image search pattern layer
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
              <ImageSearchIcon sx={{ 
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
                Image Search
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
                Draw to find images that match your sketch
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
              Draw anything on the canvas below, then click "Find Images" to search for related images.
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
                  <ImageSearchIcon sx={{ 
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
                    Drawing Canvas
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

        {/* Image Results Section */}
        <Box ref={resultsSectionRef} sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 8 }}>
          <AnimatePresence mode="wait">
            {searchQuery && (
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
                  {/* Results Header */}
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
                      <SearchIcon sx={{ 
                        color: theme.palette.primary.main,
                        fontSize: 28,
                        animation: `${pulseAnimation} 2s infinite ease-in-out`
                      }} />
                      <Box>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                          Image Results
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Found {images.length} images matching "{searchQuery}"
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Chip 
                        label={`Term: ${searchQuery}`} 
                        color="primary" 
                        size="medium"
                        sx={{ borderRadius: 2, mr: 1 }}
                      />
                      <Tooltip title="Refresh results">
                        <IconButton 
                          color="primary" 
                          onClick={() => fetchImages(searchQuery)}
                          disabled={isLoadingImages}
                          sx={{ 
                            ml: 1,
                            animation: isLoadingImages ? `${pulseAnimation} 1s infinite` : 'none'
                          }}
                        >
                          {isLoadingImages ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            <RefreshIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Gallery Container */}
                  <Box sx={{ 
                    p: { xs: 2, md: 4 },
                    maxHeight: '600px',
                    overflow: 'auto',
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.7)' : 'rgba(250,250,250,0.7)',
                  }}>
                    <ImageGallery 
                      images={images} 
                      loading={isLoadingImages} 
                      query={searchQuery} 
                    />
                  </Box>
                </Paper>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* Loading Indicator */}
      {isProcessing && (
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
              <SearchIcon 
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
            Analyzing your drawing...
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
                  placeholder="Describe what you're looking for (optional)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSearch()}
                  disabled={isProcessing}
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
                disabled={isProcessing}
                onClick={handleSearch}
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
                {isProcessing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <motion.div
                    style={{ display: 'flex', alignItems: 'center' }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SearchIcon sx={{ mr: 1 }} />
                    Find Images
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

export default CanvasImageSearch; 