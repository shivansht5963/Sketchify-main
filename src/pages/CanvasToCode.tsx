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
  Tabs,
  Tab,
  IconButton,
  Chip,
  useTheme,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputAdornment,
  Grow,
  Fade,
  InputBase
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import Html from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import JavascriptIcon from '@mui/icons-material/Javascript';
import ReactIcon from '@mui/icons-material/Code';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BrushIcon from '@mui/icons-material/Brush';
import Canvas from './Canvas';
import { canvasToImage } from '../services/aiAssistantService';
import { generateCodeFromCanvas } from '../services/aiCanvasToCodeService';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark, docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { motion, AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import PreviewIcon from '@mui/icons-material/Visibility';
import SendIcon from '@mui/icons-material/Send';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import PaletteIcon from '@mui/icons-material/Palette';
import { keyframes } from '@emotion/react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`code-tabpanel-${index}`}
      aria-labelledby={`code-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Add loading animation keyframes
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

// Add more animation keyframes
const shimmerAnimation = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(78, 205, 196, 0.2); }
  50% { box-shadow: 0 0 20px rgba(78, 205, 196, 0.4); }
  100% { box-shadow: 0 0 5px rgba(78, 205, 196, 0.2); }
`;

const CanvasToCode: React.FC = () => {
  const theme = useTheme();
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [generatedCode, setGeneratedCode] = useState<{
    react: string;
    html: string;
    css: string;
    description: string;
    javascript?: string;
  } | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const canvasRef = useRef<any>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(true);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Auto-scroll to results when code is generated
  useEffect(() => {
    if (generatedCode && resultsSectionRef.current) {
      resultsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedCode]);

  const handleGenerateCode = async () => {
    setIsProcessing(true);
    setGeneratedCode(null);
    
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
      
      // Generate code based on canvas
      const result = await generateCodeFromCanvas(imageData, input, 'react');
      
      if (result.success && result.code) {
        setLoadingProgress(100);
        setTimeout(() => {
          setGeneratedCode({
            react: result.code?.react ?? "",
            html: result.code?.html ?? "",
            css: result.code?.css ?? "",
            javascript: result.code?.javascript ?? "",
            description: result.code?.description ?? ""
          });
          showSnackbar('Code generated successfully!', 'success');
          setIsProcessing(false);
          setLoadingProgress(0);
        }, 500);
      } else {
        showSnackbar(result.message || 'Failed to generate code', 'error');
        setIsProcessing(false);
        setLoadingProgress(0);
      }
      
    } catch (error) {
      console.error("Error generating code:", error);
      showSnackbar('Error generating code. Please try again.', 'error');
      setIsProcessing(false);
      setLoadingProgress(0);
    }
    clearInterval(progressInterval);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        showSnackbar('Code copied to clipboard!', 'success');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        showSnackbar('Failed to copy to clipboard', 'error');
      });
  };

  const handleDownloadCode = (code: string, filename: string) => {
    const element = document.createElement('a');
    const file = new Blob([code], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    showSnackbar(`Downloaded ${filename}`, 'success');
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const renderPreview = () => {
    if (!generatedCode) return;

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              /* Reset default styles */
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              /* Preview container styles */
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                min-height: 100vh;
                background: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              }

              /* Generated styles */
              ${generatedCode.css}
            </style>
          </head>
          <body>
            <!-- Generated HTML -->
            ${generatedCode.html}

            <!-- Generated JavaScript -->
            ${generatedCode.javascript ? `
              <script>
                try {
                  ${generatedCode.javascript}
                } catch (error) {
                  console.error('JavaScript execution error:', error);
                }
              </script>
            ` : ''}
          </body>
        </html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      if (previewIframeRef.current) {
        previewIframeRef.current.src = url;
      }

      const cleanup = () => {
        URL.revokeObjectURL(url);
      };

      if (previewIframeRef.current) {
        previewIframeRef.current.onload = cleanup;
      }

    } catch (error) {
      console.error('Preview generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      if (previewIframeRef.current) {
        previewIframeRef.current.srcdoc = `
          <html>
            <body style="margin:0; padding:20px; font-family: system-ui; background:#fff;">
              <div style="color: red;">
                Error generating preview: ${errorMessage}
              </div>
            </body>
          </html>
        `;
      }
    }
  };

  useEffect(() => {
    if (showPreview && generatedCode) {
      renderPreview();
    }
  }, [showPreview, generatedCode]);

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
      // Drawing tools pattern layer
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

      {/* Enhanced Header with Animation */}
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
              <PaletteIcon sx={{ 
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
                Sketch to Code
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
                Draw your UI and watch it come to life
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
              Draw your UI design on the canvas below, then click "Generate Code" to convert it to usable code.
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
              height: '950px',
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
                  <BrushIcon sx={{ 
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

        {/* Results Section with Enhanced Animation */}
        <Box ref={resultsSectionRef} sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 8 }}>
          <AnimatePresence mode="wait">
            {generatedCode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ width: '100%', maxWidth: '1600px' }}
              >
                <Box sx={{ 
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: theme.palette.divider,
                }}>
                  {/* Description */}
                  <Box sx={{ 
                    p: 3, 
                    borderBottom: '1px solid', 
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Component Description
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {generatedCode.description}
                      </Typography>
                    </Box>
                    <Button
                      variant="outlined"
                      startIcon={<PreviewIcon />}
                      onClick={() => setShowPreview(!showPreview)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        minWidth: 120,
                      }}
                    >
                      {showPreview ? 'Hide Preview' : 'Show Preview'}
                    </Button>
                  </Box>
                  
                  {/* Preview and Code Container */}
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: showPreview ? 'row' : 'column' } }}>
                    {/* Code Tabs Section */}
                    <Box sx={{ 
                      width: { xs: '100%', md: showPreview ? '50%' : '100%' },
                      borderRight: { xs: 'none', md: showPreview ? `1px solid ${theme.palette.divider}` : 'none' }
                    }}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                          value={tabValue} 
                          onChange={handleTabChange} 
                          aria-label="code tabs"
                          variant="scrollable"
                          scrollButtons="auto"
                        >
                          <Tab 
                            icon={<ReactIcon />} 
                            label="React Component" 
                            sx={{ minHeight: 48, textTransform: 'none' }}
                          />
                          <Tab 
                            icon={<Html />} 
                            label="HTML" 
                            sx={{ minHeight: 48, textTransform: 'none' }}
                          />
                          <Tab 
                            icon={<CssIcon />} 
                            label="CSS" 
                            sx={{ minHeight: 48, textTransform: 'none' }}
                          />
                          {generatedCode.javascript && (
                            <Tab 
                              icon={<JavascriptIcon />} 
                              label="JavaScript" 
                              sx={{ minHeight: 48, textTransform: 'none' }}
                            />
                          )}
                        </Tabs>
                      </Box>
                      
                      <Box sx={{ maxHeight: '500px', overflow: 'auto' }}>
                        <TabPanel value={tabValue} index={0}>
                          <Box sx={{ position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }}>
                              <Tooltip title="Copy to clipboard">
                                <IconButton 
                                  onClick={() => handleCopyCode(generatedCode.react)}
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'background.paper', 
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: `${theme.palette.primary.main}20` } 
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download as file">
                                <IconButton 
                                  onClick={() => handleDownloadCode(generatedCode.react, 'Component.jsx')}
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'background.paper', 
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: `${theme.palette.primary.main}20` }
                                  }}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            <SyntaxHighlighter 
                              language="jsx" 
                              style={theme.palette.mode === 'dark' ? atomOneDark : docco}
                              customStyle={{ 
                                borderRadius: '8px',
                                padding: '16px',
                                height: '100%',
                                minHeight: '200px',
                                maxHeight: '400px',
                                overflow: 'auto'
                              }}
                              showLineNumbers
                            >
                              {generatedCode.react}
                            </SyntaxHighlighter>
                          </Box>
                        </TabPanel>
                        
                        <TabPanel value={tabValue} index={1}>
                          <Box sx={{ position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }}>
                              <Tooltip title="Copy to clipboard">
                                <IconButton 
                                  onClick={() => handleCopyCode(generatedCode.html)}
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'background.paper', 
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: `${theme.palette.primary.main}20` }
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download as file">
                                <IconButton 
                                  onClick={() => handleDownloadCode(generatedCode.html, 'index.html')}
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'background.paper', 
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: `${theme.palette.primary.main}20` }
                                  }}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            <SyntaxHighlighter 
                              language="html" 
                              style={theme.palette.mode === 'dark' ? atomOneDark : docco}
                              customStyle={{ 
                                borderRadius: '8px',
                                padding: '16px',
                                height: '100%', 
                                minHeight: '200px',
                                maxHeight: '400px',
                                overflow: 'auto'
                              }}
                              showLineNumbers
                            >
                              {generatedCode.html}
                            </SyntaxHighlighter>
                          </Box>
                        </TabPanel>
                        
                        <TabPanel value={tabValue} index={2}>
                          <Box sx={{ position: 'relative' }}>
                            <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }}>
                              <Tooltip title="Copy to clipboard">
                                <IconButton 
                                  onClick={() => handleCopyCode(generatedCode.css)}
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'background.paper', 
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: `${theme.palette.primary.main}20` }
                                  }}
                                >
                                  <ContentCopyIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Download as file">
                                <IconButton 
                                  onClick={() => handleDownloadCode(generatedCode.css, 'styles.css')}
                                  size="small"
                                  sx={{ 
                                    bgcolor: 'background.paper', 
                                    boxShadow: 1,
                                    '&:hover': { bgcolor: `${theme.palette.primary.main}20` }
                                  }}
                                >
                                  <DownloadIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                            <SyntaxHighlighter 
                              language="css" 
                              style={theme.palette.mode === 'dark' ? atomOneDark : docco}
                              customStyle={{ 
                                borderRadius: '8px',
                                padding: '16px',
                                height: '100%',
                                minHeight: '200px',
                                maxHeight: '400px',
                                overflow: 'auto'
                              }}
                              showLineNumbers
                            >
                              {generatedCode.css}
                            </SyntaxHighlighter>
                          </Box>
                        </TabPanel>
                        
                        {generatedCode.javascript && (
                          <TabPanel value={tabValue} index={3}>
                            <Box sx={{ position: 'relative' }}>
                              <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, display: 'flex', gap: 1 }}>
                                <Tooltip title="Copy to clipboard">
                                  <IconButton 
                                    onClick={() => handleCopyCode(generatedCode.javascript ?? "")}
                                    size="small"
                                    sx={{ 
                                      bgcolor: 'background.paper', 
                                      boxShadow: 1,
                                      '&:hover': { bgcolor: `${theme.palette.primary.main}20` }
                                    }}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Download as file">
                                  <IconButton 
                                    onClick={() => handleDownloadCode(generatedCode.javascript ?? "", 'script.js')}
                                    size="small"
                                    sx={{ 
                                      bgcolor: 'background.paper', 
                                      boxShadow: 1,
                                      '&:hover': { bgcolor: `${theme.palette.primary.main}20` }
                                    }}
                                  >
                                    <DownloadIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                              <SyntaxHighlighter 
                                language="javascript" 
                                style={theme.palette.mode === 'dark' ? atomOneDark : docco}
                                customStyle={{ 
                                  borderRadius: '8px',
                                  padding: '16px',
                                  maxHeight: '400px',
                                  overflow: 'auto',
                                  fontSize: '14px'
                                }}
                                showLineNumbers
                                wrapLines={true}
                              >
                                {generatedCode.javascript ?? ""}
                              </SyntaxHighlighter>
                            </Box>
                          </TabPanel>
                        )}
                      </Box>
                    </Box>

                    {/* Preview Section */}
                    {showPreview && (
                      <Box sx={{ 
                        width: { xs: '100%', md: '50%' },
                        height: '500px',
                        position: 'relative',
                        bgcolor: '#f5f5f5',
                      }}>
                        <Box sx={{ 
                          p: 2, 
                          borderBottom: `1px solid ${theme.palette.divider}`,
                          bgcolor: theme.palette.background.paper,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          justifyContent: 'space-between'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PreviewIcon fontSize="small" color="primary" />
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="subtitle2">
                                Live Preview
                              </Typography>
                              <Chip
                                size="small"
                                label="HTML/CSS/JS"
                                sx={{
                                  ml: 1,
                                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                  border: '1px solid',
                                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ 
                          height: 'calc(100% - 48px)',
                          overflow: 'hidden',
                          borderRadius: 1,
                          position: 'relative'
                        }}>
                          <iframe
                            ref={previewIframeRef}
                            title="Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              border: 'none',
                              backgroundColor: '#ffffff'
                            }}
                            sandbox="allow-scripts"
                          />
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
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
              <AutoAwesomeIcon 
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
            Generating your code...
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
                  placeholder="Describe what you're drawing (optional)..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleGenerateCode()}
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
                onClick={handleGenerateCode}
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
                    <SendIcon sx={{ mr: 1 }} />
                    Generate Code
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

export default CanvasToCode; 