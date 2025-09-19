import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Button, 
  alpha, 
  useTheme,
  Drawer,
  List,
  ListItem,
  IconButton
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useThemeMode } from '../../theme/ThemeContext';

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'tools', label: 'Tools' },
  { id: 'about', label: 'Why Choose Sketchify' },
  { id: 'contact', label: 'Contact' }
];

const SpinningLogo = motion.img;

const Navbar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { mode, toggleColorMode } = useThemeMode();

  // Handle navigation
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // If we're not on the home page, navigate there first
    if (location.pathname !== '/') {
      navigate('/');
      // We need to wait for navigation to complete before scrolling
      setTimeout(() => {
        scrollToElementById(sectionId);
      }, 100);
      return;
    }
    
    scrollToElementById(sectionId);
  };
  
  const scrollToElementById = (elementId: string) => {
    if (elementId === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      const element = document.getElementById(elementId);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        
        window.scrollTo({
          top: elementPosition - navbarHeight,
          behavior: 'smooth'
        });
      }
    }
  };

  // Add scroll event listener to update active section
  useEffect(() => {
    if (location.pathname !== '/') return;
    
    const handleScroll = () => {
      const sections = ['home', 'features', 'demo', 'future-tools', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100; // Add offset for navbar

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          if (top <= 100 && bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        background: theme.palette.mode === 'dark'
          ? 'linear-gradient(90deg, rgba(10,25,41,0.95) 0%, rgba(26,32,39,0.95) 100%)'
          : 'linear-gradient(90deg, #4ECDC4 0%, #FF6B6B 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
        height: '80px',
      }}
    >
      <Toolbar 
        sx={{ 
          justifyContent: 'space-between',
          minHeight: '80px !important',
          px: 2,
        }}
      >
        <Box 
          sx={{ 
            position: 'relative',
            height: '80px',
            width: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onClick={() => scrollToSection('home')}
        >
          <SpinningLogo
            src="/Sketchify-removebg2.png"
            alt="Sketchify Logo"
            initial={{ 
              opacity: 0,
              scale: 0.5,
              rotate: -180
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
              type: "spring",
              stiffness: 100
            }}
            style={{
              width: 190,
              height: 'auto',
              objectFit: 'contain',
              filter: `
                drop-shadow(0 0 12px rgba(255,255,255,0.4))
                drop-shadow(0 0 8px rgba(0,0,0,0.3))
                drop-shadow(0 4px 12px rgba(78,205,196,0.5))
              `,
            }}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
            whileTap={{ 
              scale: 0.9,
              rotate: -5
            }}
          />
        </Box>
        
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          <IconButton 
            onClick={toggleMobileMenu}
            sx={{ color: '#FFFFFF' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, ml: 'auto' }}>
          <IconButton onClick={toggleColorMode} sx={{ color: '#FFFFFF', mr: 2 }}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {navItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              sx={{
                color: '#FFFFFF',
                fontWeight: 500,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  width: activeSection === item.id ? '100%' : '0%',
                  height: '2px',
                  background: '#FFFFFF',
                  transition: 'all 0.3s ease',
                  transform: 'translateX(-50%)',
                },
                '&:hover::after': {
                  width: '100%',
                },
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              {item.label}
              {item.id === 'future-tools' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#FF6B6B',
                    animation: 'pulse 2s infinite'
                  }}
                />
              )}
            </Button>
          ))}
        </Box>
      </Toolbar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: '70%',
            background: 'linear-gradient(135deg, #4ECDC4 0%, #FF6B6B 100%)',
            boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
            px: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
          <IconButton onClick={toggleMobileMenu} sx={{ color: '#FFFFFF' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <IconButton onClick={toggleColorMode} sx={{ color: '#FFFFFF', mb: 2 }}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          {navItems.map((item) => (
            <ListItem key={item.id} disablePadding>
              <Button
                fullWidth
                onClick={() => {
                  scrollToSection(item.id);
                  toggleMobileMenu();
                }}
                sx={{
                  py: 2,
                  color: '#FFFFFF',
                  justifyContent: 'flex-start',
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 0,
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                  },
                  position: 'relative'
                }}
              >
                {item.label}
                {item.id === 'future-tools' && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                )}
              </Button>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 