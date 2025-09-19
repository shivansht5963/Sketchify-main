import React from 'react';
import { Box, Container, Grid, Typography, Button, useTheme, Avatar, Paper, Stack, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import EastIcon from '@mui/icons-material/East';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import MemoryIcon from '@mui/icons-material/Memory';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import DevicesIcon from '@mui/icons-material/Devices';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const theme = useTheme();
  
  // Feature list for "Why Choose Nexa"
  const features = [
    {
      icon: <AutoFixHighIcon />,
      title: "AI-Powered Precision",
      description: "Our advanced algorithms understand your sketches with remarkable accuracy, delivering results that match your intent."
    },
    {
      icon: <MemoryIcon />,
      title: "Cutting-Edge Technology",
      description: "Built on state-of-the-art machine learning models trained on millions of design samples and code patterns."
    },
    {
      icon: <SecurityIcon />,
      title: "Secure & Private",
      description: "Your sketches and data remain private and secure. We never store your designs without your permission."
    },
    {
      icon: <SpeedIcon />,
      title: "Lightning Fast",
      description: "Get results in seconds, not minutes. Our optimization makes complex AI processing incredibly fast."
    },
    {
      icon: <DevicesIcon />,
      title: "Cross-Platform",
      description: "Works seamlessly across all your devices - desktop, tablet, or mobile with a consistent experience."
    },
    {
      icon: <CelebrationIcon />,
      title: "Constantly Improving",
      description: "We regularly update our AI models and add new features based on user feedback and technological advances."
    }
  ];

  return (
    <Box 
      component="section"
      id="about" 
      sx={{ 
        position: 'relative',
        py: { xs: 10, md: 16 },
        scrollMarginTop: '80px',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(180deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9))' 
          : 'linear-gradient(180deg, rgba(248, 250, 252, 0.7), rgba(248, 250, 252, 0.9))',
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '40%',
          height: '50%',
          opacity: 0.4,
          background: `url("data:image/svg+xml,%3Csvg width='300' height='300' viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='150' cy='150' r='100' stroke='%234ECDC4' stroke-width='2' fill='none' stroke-dasharray='8 12' opacity='0.2'/%3E%3Ccircle cx='150' cy='150' r='70' stroke='%23FF6B6B' stroke-width='2' fill='none' stroke-dasharray='6 8' opacity='0.2'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          zIndex: -1,
      }}
      />
      
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 10 }} alignItems="center">
          {/* About content */}
          <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Box>
                <Typography
                  variant="overline"
                  sx={{
                    fontSize: { xs: '0.9rem', md: '1rem' },
                    fontWeight: 600,
                    letterSpacing: 1.2,
                    mb: 2,
                    color: theme.palette.mode === 'dark' ? '#4ECDC4' : '#4ECDC4',
                    textTransform: 'uppercase',
                    display: 'block',
                  }}
                >
                  Our Story
                </Typography>
                
        <Typography 
          variant="h2" 
                  component="h2"
          sx={{ 
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                    fontWeight: 800,
                    mb: 3,
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #4ECDC4, #FF6B6B)'
                      : 'linear-gradient(90deg, #4ECDC4, #FF6B6B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textFillColor: 'transparent',
          }}
        >
                  Bridging Creativity & Technology
                </Typography>
                
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: '1.1rem',
                    mb: 3,
                    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    lineHeight: 1.8,
                  }}
                >
                  Nexa began with a simple question: <strong>what if turning a sketch into functional code or finding similar images was as easy as drawing?</strong> Created for SYNAPSE 2025, our team set out to bridge the gap between creative expression and technological implementation.
                </Typography>
                
                <Typography 
                  variant="body1"
                  sx={{ 
                    fontSize: '1.1rem',
                    mb: 3,
                    color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                    lineHeight: 1.8,
                  }}
                >
                  We've built a platform that understands the intent behind your sketches and transforms them into actionable results—whether that's code, solutions, or visual references. Our AI doesn't just recognize what you've drawn; it comprehends the context and purpose behind it.
        </Typography>
                
                <Box sx={{ mt: 5 }}>
                  {/* Try Sketchify button removed for streamlined user flow */}
                </Box>
              </Box>
            </motion.div>
          </Grid>
          
          {/* Image or illustration */}
          <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
                    : '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                  height: { xs: '300px', md: '400px' },
                  background: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                  border: theme.palette.mode === 'dark' 
                    ? '1px solid rgba(255, 255, 255, 0.1)' 
                    : '1px solid rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 3,
                }}
              >
                <svg 
                  width="100%" 
                  height="100%" 
                  viewBox="0 0 800 600" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    filter: 'drop-shadow(0px 4px 12px rgba(0, 0, 0, 0.15))'
                  }}
                >
                  {/* Canvas/Sketch Background */}
                  <rect x="100" y="100" width="600" height="400" rx="20" fill={theme.palette.mode === 'dark' ? '#2A2A2A' : '#FFFFFF'} stroke="#4ECDC4" strokeWidth="4" />
                  
                  {/* Person Drawing */}
                  <circle cx="200" cy="480" r="60" fill={theme.palette.mode === 'dark' ? '#555555' : '#EEEEEE'} />
                  <rect x="180" y="550" width="40" height="100" rx="10" fill={theme.palette.mode === 'dark' ? '#555555' : '#EEEEEE'} />
                  <rect x="160" y="600" width="80" height="20" rx="5" fill={theme.palette.mode === 'dark' ? '#444444' : '#DDDDDD'} />
                  <circle cx="200" cy="460" r="30" fill={theme.palette.mode === 'dark' ? '#666666' : '#F8F8F8'} />
                  
                  {/* AI Technology Elements */}
                  <circle cx="400" cy="250" r="50" fill="rgba(78, 205, 196, 0.1)" stroke="#4ECDC4" strokeWidth="3" strokeDasharray="10 5" />
                  <circle cx="400" cy="250" r="70" fill="transparent" stroke="#4ECDC4" strokeWidth="2" strokeDasharray="5 8" />
                  <circle cx="400" cy="250" r="90" fill="transparent" stroke="#4ECDC4" strokeWidth="1" strokeDasharray="3 10" />
                  
                  {/* Code Output */}
                  <rect x="550" y="150" width="160" height="300" rx="10" fill={theme.palette.mode === 'dark' ? '#333333' : '#F0F0F0'} />
                  <rect x="570" y="170" width="120" height="10" rx="5" fill={theme.palette.mode === 'dark' ? '#4ECDC4' : '#4ECDC4'} opacity="0.7" />
                  <rect x="570" y="190" width="80" height="10" rx="5" fill={theme.palette.mode === 'dark' ? '#FF6B6B' : '#FF6B6B'} opacity="0.7" />
                  <rect x="570" y="210" width="100" height="10" rx="5" fill={theme.palette.mode === 'dark' ? '#FFFFFF' : '#666666'} opacity="0.5" />
                  <rect x="570" y="230" width="90" height="10" rx="5" fill={theme.palette.mode === 'dark' ? '#FFFFFF' : '#666666'} opacity="0.5" />
                  <rect x="570" y="250" width="110" height="10" rx="5" fill={theme.palette.mode === 'dark' ? '#4ECDC4' : '#4ECDC4'} opacity="0.7" />
                  <rect x="570" y="270" width="70" height="10" rx="5" fill={theme.palette.mode === 'dark' ? '#FF6B6B' : '#FF6B6B'} opacity="0.7" />
                  <rect x="570" y="290" width="120" height="10" rx="5" fill={theme.palette.mode === 'dark' ? '#FFFFFF' : '#666666'} opacity="0.5" />
                  <rect x="570" y="310" width="100" height="10" rx="5" fill={theme.palette.mode === 'dark' ? '#FFFFFF' : '#666666'} opacity="0.5" />
                  
                  {/* Sketch/Drawing */}
                  <path d="M200 250 Q300 180 400 250 Q500 320 550 250" stroke="#FF6B6B" strokeWidth="3" fill="transparent" />
                  <path d="M250 300 Q350 350 450 300" stroke="#4ECDC4" strokeWidth="3" fill="transparent" />
                  <rect x="150" y="200" width="80" height="50" rx="5" stroke="#FF6B6B" strokeWidth="2" fill="transparent" />
                  <circle cx="350" cy="350" r="30" stroke="#4ECDC4" strokeWidth="2" fill="transparent" />
                  
                  {/* Connection Lines */}
                  <path d="M400 250 L550 250" stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} strokeWidth="2" strokeDasharray="5 5" />
                  <path d="M250 250 L350 250" stroke={theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} strokeWidth="2" strokeDasharray="5 5" />
                  
                  {/* Stars/Sparkles */}
                  <path d="M300 120 L305 130 L315 130 L307 137 L310 147 L300 142 L290 147 L293 137 L285 130 L295 130 Z" fill="#FF6B6B" />
                  <path d="M500 180 L505 190 L515 190 L507 197 L510 207 L500 202 L490 207 L493 197 L485 190 L495 190 Z" fill="#4ECDC4" />
                  <path d="M450 350 L455 360 L465 360 L457 367 L460 377 L450 372 L440 377 L443 367 L435 360 L445 360 Z" fill="#FF6B6B" />
                </svg>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
        
        {/* Why Choose Us Section */}
        <Box sx={{ mt: { xs: 10, md: 16 } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Typography
              variant="h3"
              component="h2"
              align="center"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                fontWeight: 800,
                mb: 6,
                color: theme.palette.mode === 'dark' ? 'white' : 'rgba(0,0,0,0.8)',
              }}
            >
              Why Choose <span style={{ 
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #4ECDC4, #FF6B6B)' 
                  : 'linear-gradient(90deg, #4ECDC4, #FF6B6B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Sketchify</span>
            </Typography>
          </motion.div>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                  height: '100%',
                      borderRadius: 3,
                      background: theme.palette.mode === 'dark' 
                        ? 'rgba(30, 41, 59, 0.4)' 
                        : 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderLeft: `3px solid ${index % 2 === 0 ? '#4ECDC4' : '#FF6B6B'}`,
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 2,
                        color: index % 2 === 0 ? '#4ECDC4' : '#FF6B6B',
                      }}
                    >
                      {feature.icon}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        mb: 1.5,
                        color: theme.palette.mode === 'dark' ? 'white' : 'rgba(0,0,0,0.8)',
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                        lineHeight: 1.6,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About; 