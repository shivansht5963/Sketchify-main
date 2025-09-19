import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  TextField, 
  Button, 
  useTheme, 
  alpha 
} from '@mui/material';
import { motion } from 'framer-motion';
import EmailIcon from '@mui/icons-material/Email';

const Contact: React.FC = () => {
  const theme = useTheme();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Form submitted');
  };

  return (
    <Box 
      component="section"
      id="contact" 
      sx={{ 
        position: 'relative',
        py: { xs: 10, md: 16 },
        scrollMarginTop: '80px',
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography 
            variant="h2" 
            align="center" 
            sx={{ 
              mb: 2,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Get in Touch
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            color="text.secondary" 
            sx={{ mb: 8 }}
          >
            Have questions? We'd love to hear from you.
          </Typography>

          <Card
            sx={{
              p: 4,
              borderRadius: '20px',
              background: alpha(theme.palette.background.paper, 0.8),
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            <form onSubmit={handleSubmit}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    sx={{ mb: 3 }}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={7}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<EmailIcon />}
                    sx={{
                      mt: 2,
                      background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                      borderRadius: '10px',
                      padding: '10px 24px',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #FF5555, #45B7D1)',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Contact;