import React from 'react';
import { Box, Container, Grid, Typography, Paper, useTheme, Avatar, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import BrushIcon from '@mui/icons-material/Brush';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const HowItWorks: React.FC = () => {
  const theme = useTheme();
  
  // Steps data
  const steps = [
    {
      id: 1,
      title: "Draw Your Sketch",
      description: "Use our intuitive canvas to draw your ideas, designs, math problems, or anything else you want to analyze.",
      icon: <BrushIcon fontSize="large" />,
      color: "#4ECDC4",
      image: "/images/step-draw.png" // You can replace with actual images
    },
    {
      id: 2,
      title: "Add Your Prompt",
      description: "Write a prompt to guide the AI analysis. Be specific about what insights or information you're looking for.",
      icon: <TextFieldsIcon fontSize="large" />,
      color: "#FF6B6B",
      image: "/images/step-prompt.png"
    },
    {
      id: 3,
      title: "Get AI Analysis",
      description: "Receive detailed insights, explanations, code, solutions, or similar images based on your sketch and prompt.",
      icon: <AnalyticsIcon fontSize="large" />,
      color: "#4ECDC4",
      image: "/images/step-result.png"
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <Box
      component="section"
      id="how-it-works"
      sx={{
        position: 'relative',
        py: { xs: 10, md: 16 },
        overflow: 'hidden',
        scrollMarginTop: '80px',
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.8))'
          : 'linear-gradient(180deg, rgba(248, 250, 252, 0), rgba(248, 250, 252, 0.8))',
      }}
    >
      {/* Decorative background elements */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 0,
        opacity: 0.5,
      }}>
        {/* Process flow line */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '10%',
            right: '10%',
            height: '2px',
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(90deg, rgba(78, 205, 196, 0.3), rgba(255, 107, 107, 0.3))'
              : 'linear-gradient(90deg, rgba(78, 205, 196, 0.5), rgba(255, 107, 107, 0.5))',
            display: { xs: 'none', md: 'block' },
            zIndex: -1,
          }}
        />
        
        {/* Drawing elements and brush strokes */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '20%',
            height: '25%',
            background: `url("data:image/svg+xml,%3Csvg width='200' height='100' viewBox='0 0 200 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 50c20-30 40-20 60-10 30 15 40 5 60-15' stroke='%234ECDC4' stroke-width='2' fill='none' stroke-linecap='round' opacity='0.2'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            zIndex: -1,
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '25%',
            height: '20%',
            background: `url("data:image/svg+xml,%3Csvg width='200' height='100' viewBox='0 0 200 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M190 30c-30 40-50 30-70 20-20-10-30-10-50 10-20 20-40 20-60 0' stroke='%23FF6B6B' stroke-width='2' fill='none' stroke-linecap='round' opacity='0.2'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            zIndex: -1,
          }}
        />
        
        {/* Canvas grid */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: theme.palette.mode === 'dark'
              ? `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), 
                 linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`
              : `linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
            zIndex: -1,
          }}
        />
      </Box>

      <Container maxWidth="lg">
        {/* Section heading */}
        <Box sx={{ position: 'relative', zIndex: 1, mb: { xs: 8, md: 10 }, textAlign: 'center' }}>
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
              Simple Process
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
              How It Works
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
              Sketchify makes it easy to get AI-powered insights from your drawings in just three simple steps.
            </Typography>
          </motion.div>
        </Box>

        {/* Process steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <Grid container spacing={{ xs: 6, md: 2 }} justifyContent="center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <Grid item xs={12} md={4}>
                  <motion.div variants={itemVariants}>
                    <Box sx={{ position: 'relative', height: '100%', textAlign: 'center' }}>
                      {/* Step number */}
                      <Avatar
                        sx={{
                          width: 70,
                          height: 70,
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'white',
                          color: step.color,
                          fontWeight: 800,
                          fontSize: '1.5rem',
                          mb: 3,
                          border: `3px solid ${step.color}`,
                          boxShadow: `0 0 0 4px ${step.color}20`,
                          mx: 'auto',
                          zIndex: 2,
                        }}
                      >
                        {step.id}
                      </Avatar>
                      
                      {/* Step card */}
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          pt: 5,
                          pb: 5,
                          mt: -5,
                          borderRadius: 4,
                          background: theme.palette.mode === 'dark' 
                            ? 'rgba(30, 41, 59, 0.4)' 
                            : 'rgba(255, 255, 255, 0.8)',
                          backdropFilter: 'blur(10px)',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-8px)',
                            boxShadow: theme.palette.mode === 'dark'
                              ? '0 20px 30px -10px rgba(0, 0, 0, 0.3)'
                              : '0 20px 30px -10px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: step.color,
                            mb: 2,
                          }}
                        >
                          {step.icon}
                        </Box>
                        
                        <Typography
                          variant="h5"
                          component="h4"
                          sx={{
                            fontSize: { xs: '1.25rem', md: '1.5rem' },
                            fontWeight: 700,
                            mb: 2,
                            color: step.color,
                          }}
                        >
                          {step.title}
                        </Typography>
                        
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '1rem',
                            color: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
                            lineHeight: 1.6,
                            mb: 4,
                          }}
                        >
                          {step.description}
                        </Typography>
                        
                        {/* Step illustration */}
                        <Box
                          sx={{
                            width: '100%',
                            height: 180,
                            borderRadius: 2,
                            overflow: 'hidden',
                            mt: 'auto',
                            background: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.5)' : 'rgba(240, 240, 240, 0.5)',
                            border: theme.palette.mode === 'dark' 
                              ? '1px solid rgba(255, 255, 255, 0.1)' 
                              : '1px solid rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {/* Placeholder for actual image */}
                          <Typography variant="body2" color="text.secondary">
                            Step {step.id} Illustration
                          </Typography>
                        </Box>
                      </Paper>
                      
                      {/* Connector arrow (for desktop) */}
                      {index < steps.length - 1 && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            right: -16,
                            transform: 'translateY(-50%)',
                            zIndex: 3,
                            display: { xs: 'none', md: 'block' },
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'white',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            }}
                          >
                            <ArrowForwardIcon fontSize="small" sx={{ color: step.color }} />
                          </Avatar>
                        </Box>
                      )}
                    </Box>
                  </motion.div>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HowItWorks; 