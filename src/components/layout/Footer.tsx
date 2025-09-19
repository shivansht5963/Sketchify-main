import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Stack, 
  IconButton, 
  useTheme, 
  alpha 
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';

const Footer: React.FC = () => {
  const theme = useTheme();
  
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        py: 6,
        background: theme.palette.mode === 'dark'
          ? `linear-gradient(to top, ${alpha('#0A1929', 0.97)} 0%, ${alpha('#1A2027', 0.97)} 100%)`
          : `linear-gradient(to top, ${alpha('#F8FAFF', 0.97)} 0%, ${alpha('#EEF2FF', 0.97)} 100%)`,
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <img
                  src="/Sketchify.png"
                  alt="Sketchify Logo"
                  style={{
                    width: 120,
                    height: 'auto',
                    filter: 'drop-shadow(0 0 12px rgba(255,255,255,0.4))',
                  }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Transform your sketches into reality with AI-powered tools. Draw, analyze, and create with Sketchify.
              </Typography>
              <Stack direction="row" spacing={2}>
                {[
                  { icon: <FacebookIcon />, label: 'Facebook', href: '#' },
                  { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
                  { icon: <GitHubIcon />, label: 'GitHub', href: '#' },
                  { icon: <LinkedInIcon />, label: 'LinkedIn', href: '#' },
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: theme.palette.mode === 'dark' ? 'white' : 'black',
                      '&:hover': {
                        background: alpha(theme.palette.primary.main, 0.1),
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Quick Links
                </Typography>
                <Stack spacing={1}>
                  {['Home', 'Features', 'How It Works', 'Coming Soon'].map((item) => (
                    <a
                      key={item}
                      href="#"
                      style={{
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = theme.palette.primary.main;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = theme.palette.text.secondary as string;
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Resources
                </Typography>
                <Stack spacing={1}>
                  {['Documentation', 'Tutorials', 'Blog', 'Support'].map((item) => (
                    <a
                      key={item}
                      href="#"
                      style={{
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = theme.palette.primary.main;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = theme.palette.text.secondary as string;
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Legal
                </Typography>
                <Stack spacing={1}>
                  {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                    <a
                      key={item}
                      href="#"
                      style={{
                        color: theme.palette.text.secondary,
                        textDecoration: 'none',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.color = theme.palette.primary.main;
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.color = theme.palette.text.secondary as string;
                      }}
                    >
                      {item}
                    </a>
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box
          sx={{
            pt: 4,
            mt: 4,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Sketchify. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;