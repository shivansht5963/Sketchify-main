import React, { useEffect } from 'react';
import { Box, useTheme, Typography, Container } from '@mui/material';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/home/Hero';
import HowItWorks from '../components/home/HowItWorks';
import ToolsShowcase from '../components/home/ToolsShowcase';
import About from '../components/home/About';
import Contact from '../components/home/Contact';
import Footer from '../components/layout/Footer';
import FloatingCTA from '../components/ui/FloatingCTA';
import { useBackgroundAnimation } from '../hooks/useBackgroundAnimation';

const Home: React.FC = () => {
  const theme = useTheme();
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  
  // Initialize the background animation
  useBackgroundAnimation();

  return (
    <Box 
      component={motion.div}
      sx={{ 
        minHeight: '100vh',
        position: 'relative',
        pt: '80px',
        overflowX: 'hidden',
        // Main fixed background with refined gradient 
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? `
              radial-gradient(circle at 30% 20%, rgba(78, 205, 196, 0.3) 0%, transparent 35%),
              radial-gradient(circle at 70% 70%, rgba(255, 107, 107, 0.3) 0%, transparent 35%),
              linear-gradient(135deg, #0f172a, #1e293b)
            `
            : `
              radial-gradient(circle at 30% 20%, rgba(78, 205, 196, 0.2) 0%, transparent 35%),
              radial-gradient(circle at 70% 70%, rgba(255, 107, 107, 0.2) 0%, transparent 35%),
              linear-gradient(135deg, #f8fcfc, #fff5f5)
            `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%',
          backgroundAttachment: 'fixed',
          zIndex: -3,
        },
        // Drawing tools pattern layer with reduced opacity
        '&::after': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: theme.palette.mode === 'dark' ? 0.05 : 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M40 50l-8-8-8 8v60l8 8 8-8V50z' stroke='%234ECDC4' stroke-width='1.5'/%3E%3Cpath d='M24 38h32v4H24z' fill='%234ECDC4'/%3E%3Cpath d='M32 38l-4-10-4 10' stroke='%234ECDC4' stroke-width='1.5'/%3E%3Ccircle cx='120' cy='50' r='12' stroke='%23FF6B6B' stroke-width='1.5'/%3E%3Ccircle cx='120' cy='50' r='6' fill='%23FF6B6B' opacity='0.5'/%3E%3Cpath d='M120 62v30' stroke='%23FF6B6B' stroke-width='1.5' stroke-dasharray='4,4'/%3E%3Cpath d='M60 120l10 10 50-50-10-10-50 50z' fill='%234ECDC4' opacity='0.3'/%3E%3Cpath d='M60 120l10 10 50-50-10-10-50 50z' stroke='%234ECDC4' stroke-width='1'/%3E%3Cpath d='M110 80l10-10 5 15-15-5z' fill='%234ECDC4'/%3E%3Cpath d='M142 120c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z' stroke='%23FF6B6B' stroke-width='1.5'/%3E%3Cpath d='M142 120v20M137 140h10' stroke='%23FF6B6B' stroke-width='1.5'/%3E%3Cpath d='M150 30l-5-10-5 10v10h10V30z' fill='%23FF6B6B' opacity='0.4'/%3E%3Cpath d='M150 30l-5-10-5 10v10h10V30z' stroke='%23FF6B6B' stroke-width='1'/%3E%3Cpath d='M40 160c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10z' stroke='%234ECDC4' stroke-width='1.5'/%3E%3Cpath d='M35 155h10M40 150v10' stroke='%234ECDC4' stroke-width='1.5'/%3E%3Crect x='80' y='140' width='20' height='10' rx='2' stroke='%23FF6B6B' stroke-width='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundAttachment: 'fixed',
          backgroundSize: '180px 180px',
          zIndex: -2,
        },
        // Texture overlay with reduced opacity
        '.texture-overlay': {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: theme.palette.mode === 'dark' ? 0.02 : 0.015,
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          zIndex: -1,
        },
        // Subtle canvas grid
        '.canvas-grid': {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: theme.palette.mode === 'dark'
            ? `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
               linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
            : `linear-gradient(rgba(0, 0, 0, 0.01) 1px, transparent 1px), 
               linear-gradient(90deg, rgba(0, 0, 0, 0.01) 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          zIndex: -1,
          opacity: 0.5,
        },
        // Floating dots animation container
        '.floating-dots': {
          position: 'fixed',
          width: '100%',
          height: '100%',
          zIndex: -1,
          'canvas': {
            position: 'absolute',
            top: 0,
            left: 0
          }
        }
      }}
    >
      {/* Background elements */}
      <Box className="texture-overlay" />
      <Box className="canvas-grid" />
      
      {/* Floating dots */}
      <Box className="floating-dots" />

      {/* Sticky Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <Box
        component={motion.div}
        style={{ y: backgroundY }}
        sx={{ position: 'relative', zIndex: 1 }}
        id="home"
      >
      <Hero />
      </Box>
      
      {/* How It Works Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          scrollMarginTop: '80px'
        }}
        id="how-it-works"
      >
      <HowItWorks />
      </Box>
      
      {/* Tools Showcase Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          scrollMarginTop: '80px',
          background: theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.5)'
            : 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          py: 8
        }}
        id="tools"
      >
        <ToolsShowcase />
      </Box>
      
      {/* About/Why Choose Sketchify Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          scrollMarginTop: '80px'
        }}
        id="about"
      >
      <About />
      </Box>
      
      {/* Contact Section */}
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2,
          scrollMarginTop: '80px'
        }}
        id="contact"
      >
      <Contact />
      </Box>
      
      {/* Footer */}
      <Footer />
      
      {/* Floating CTA Button */}
      <FloatingCTA />
    </Box>
  );
};

export default Home; 